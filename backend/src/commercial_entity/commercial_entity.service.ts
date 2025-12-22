import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { CommercialEntityEntity } from './commercial_entity.entity';
import { CommercialEntityRoleEntity } from './commercial_entity_role.entity';
import { CreateCommercialEntityDto, UpdateCommercialEntityDto, CommercialEntityResponseDto } from './dtos';
import { RoleEnum } from 'src/enums';

@Injectable()
export class CommercialEntityService {
  constructor(
    @InjectRepository(CommercialEntityEntity)
    private readonly ceRepository: Repository<CommercialEntityEntity>,

    @InjectRepository(CommercialEntityRoleEntity)
    private readonly roleRepository: Repository<CommercialEntityRoleEntity>,
  ) {}

  async create(dto: CreateCommercialEntityDto): Promise<{ message: string; data: CommercialEntityResponseDto }> {
    const queryRunner = this.ceRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const commercial = queryRunner.manager.create(CommercialEntityEntity, {
        entity_name: dto.entity_name,
        entity_country: dto.entity_country,
      });

      const createdCommercial = await queryRunner.manager.save(commercial);

      let rolesEntities: CommercialEntityRoleEntity[] = [];

      if (dto.roles && dto.roles.length > 0) {
        rolesEntities = dto.roles.map(roleEnum => {
          const role = new CommercialEntityRoleEntity();
          role.role_type = roleEnum;
          role.commercial_entity = createdCommercial;
          return role;
        });

        await queryRunner.manager.save(CommercialEntityRoleEntity, rolesEntities);
      }

      await queryRunner.commitTransaction();

      // ✅ MAPEO A DTO (NO entidad)
      const responseDto: CommercialEntityResponseDto = {
        id: createdCommercial.id,
        entity_name: createdCommercial.entity_name,
        entity_country: createdCommercial.entity_country,
        roles: rolesEntities.map(r => r.role_type),
      };

      return {
        message: 'Commercial Entity created successfully',
        data: responseDto,
      };

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(limit = 100, offset = 0): Promise<CommercialEntityResponseDto[]> {
    const entities = await this.ceRepository.find({
      take: limit,
      skip: offset,
      relations: ['roles'],
    });

    return Promise.all(
      entities.map(entity => this.toResponseDto(entity)),
    );
  }

  async findOne(id: number) {
    const commercial = await this.ceRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!commercial) throw new NotFoundException('Commercial Entity not found');

    return this.toResponseDto(commercial);
  }

  private async toResponseDto(entity: CommercialEntityEntity): Promise<CommercialEntityResponseDto> {
    return plainToInstance(CommercialEntityResponseDto, {
      id: entity.id,
      entity_name: entity.entity_name,
      entity_country: entity.entity_country,
      roles: entity.roles?.map(r => r.role_type) ?? [], // <-- aquí transformas
    });
  }

  async update(id: number, dto: UpdateCommercialEntityDto) {
    const commercial = await this.findOneEntity(id);

    const newName = dto.entity_name ?? commercial.entity_name;
    const newCountry = dto.entity_country ?? commercial.entity_country;

    const existing = await this.ceRepository.findOne({
      where: { entity_name: newName, entity_country: newCountry },
      relations: ['roles'],
    });

    if (existing && existing.id !== id) {
      const existingRoles = existing.roles.map(r => r.role_type).sort();
      const newRoles = (dto.roles ?? []).sort();

      const rolesAreSame =
        existingRoles.length === newRoles.length &&
        existingRoles.every((r, i) => r === newRoles[i]);

      if (rolesAreSame) {
        throw new ConflictException(
          'Ya existe una entidad comercial con ese nombre y país',
        );
      } else {
        await this.changeRoles(existing.id, dto.roles ?? []);
        return {
          message: 'Roles updated successfully on existing Commercial Entity',
          data: await this.findOne(existing.id),
        };
      }
    }

    if (newName !== commercial.entity_name) commercial.entity_name = newName;
    if (newCountry !== commercial.entity_country) commercial.entity_country = newCountry;

    await this.ceRepository.save(commercial);

    if (dto.roles) {
      await this.changeRoles(id, dto.roles);
    }

    const updatedCommercial = await this.ceRepository.findOneOrFail({
      where: { id },
      relations: ['roles'],
    });

    return {
      message: 'Commercial Entity updated successfully',
      data: {
        id: updatedCommercial.id,
        entity_name: updatedCommercial.entity_name,
        entity_country: updatedCommercial.entity_country,
        roles: updatedCommercial.roles.map(r => r.role_type),
      },
    };
  }

  async remove(id: number) {
    const commercial = await this.findOneEntity(id);
    await this.ceRepository.remove(commercial);

    return { message: 'Commercial Entity deleted successfully' };
  }

  async findOneEntity(id: number): Promise<CommercialEntityEntity> {
    const entity = await this.ceRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!entity) throw new NotFoundException('Commercial Entity not found');

    return entity;
  }

  async ensureRole(entityId: number, role: RoleEnum) {
    const entity = await this.ceRepository.findOne({
      where: { id: entityId },
      relations: ['roles'],
    });

    if (!entity) throw new NotFoundException('Commercial Entity not found');

    const hasRole = entity.roles.some(r => r.role_type === role);

    if (!hasRole) {
      const newRole = this.roleRepository.create({
        commercial_entity: entity,
        role_type: role,
      });
      await this.roleRepository.save(newRole);
    }
  }

  async changeRoles(entityId: number, roles: RoleEnum[]) {
    const entity = await this.ceRepository.findOne({
      where: { id: entityId },
      relations: ['roles'],
    });

    if (!entity) {
      throw new NotFoundException('Commercial Entity not found');
    }

    // Roles a eliminar
    const rolesToRemove = entity.roles.filter(
      r => !roles.includes(r.role_type),
    );
    if (rolesToRemove.length) {
      await this.roleRepository.remove(rolesToRemove);
    }

    // Roles a agregar
    const existingRoleTypes = entity.roles.map(r => r.role_type);
    const rolesToAdd = roles.filter(r => !existingRoleTypes.includes(r));

    if (rolesToAdd.length) {
      const newRoles = rolesToAdd.map(role =>
        this.roleRepository.create({
          commercial_entity: entity,
          role_type: role,
        }),
      );
      await this.roleRepository.save(newRoles);
    }

    return { message: 'Roles updated successfully' };
  }

  async upsertByIdentity(entity_name: string, entity_country: string, roles: RoleEnum[]): Promise<CommercialEntityEntity> {
    // 1️⃣ Buscar por identidad
    let entity = await this.ceRepository.findOne({
      where: { entity_name, entity_country },
      relations: ['roles'],
    });

    // 2️⃣ Si NO existe → crear
    if (!entity) {
      entity = this.ceRepository.create({
        entity_name,
        entity_country,
      });
      entity = await this.ceRepository.save(entity);
    }

    // 3️⃣ Sincronizar roles (NO tocar name/country)
    if (roles) {
      await this.changeRoles(entity.id, roles);
    }

    return entity;
  }
}
