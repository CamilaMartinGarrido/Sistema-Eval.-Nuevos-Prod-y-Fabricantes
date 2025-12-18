import { Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MakerEntity } from './maker.entity';
import { CreateMakerDto, UpdateMakerDto, MakerResponseDto } from './dtos';
import { CommercialEntityService } from '../commercial_entity/commercial_entity.service';
import { toDto } from 'src/common/utils/mapper.util';

@Injectable()
export class MakerService {
  constructor(
    @InjectRepository(MakerEntity)
    private readonly makerRepository: Repository<MakerEntity>,
    
    @Inject(forwardRef(() => CommercialEntityService))
    private readonly ceService: CommercialEntityService,
  ) {}

  async create(dto: CreateMakerDto): Promise<{ message: string; data: MakerEntity }> {
    let commercialEntity;

    // Caso 1: se pasa el ID de la entidad comercial
    if (dto.commercial_entity_id) {
      commercialEntity = await this.ceService.findOne(dto.commercial_entity_id);

      if (!commercialEntity) {
        throw new NotFoundException('Commercial entity not found');
      }

    // Caso 2: se pasan los datos de la entidad comercial
    } else if (dto.commercial_entity) {
      // Buscar si ya existe para evitar duplicados
      commercialEntity = await this.ceService.findByNameAndCountry(
        dto.commercial_entity.entity_name,
        dto.commercial_entity.entity_country,
      );

      if (!commercialEntity) {
        const result = await this.ceService.create(dto.commercial_entity);
        commercialEntity = result.data;
      }
    } else {
      throw new NotFoundException('Commercial entity data is required');
    }

    // Crear el Maker
    const maker = this.makerRepository.create({ commercial_entity: commercialEntity });
    const created = await this.makerRepository.save(maker);

    return { 
      message: 'Maker created successfully',
      data: created,
    };
  }

  async findAll(limit = 100, offset = 0): Promise<MakerResponseDto[]> {
    const makers = await this.makerRepository.find({ take: limit, skip: offset });

    return Promise.all(
      makers.map((maker) => this.toResponseDto(maker))
    );
  }

  async findOne(id: number): Promise<MakerResponseDto> {
    const maker = await this.makerRepository.findOne({ where: { id } });
    if (!maker) throw new NotFoundException('Maker not found');

    return this.toResponseDto(maker);
  }

  private async toResponseDto(entity: MakerEntity): Promise<MakerResponseDto> {
    return toDto(MakerResponseDto, entity);
  }

  async update(id: number, dto: UpdateMakerDto) {
    const maker = await this.makerRepository.findOneBy({ id });
    if (!maker) throw new NotFoundException('Maker not found');

    // Si se pasa un id de entidad comercial → asignar la entidad
    if (dto.commercial_entity_id) {
      const commercial = await this.ceService.findOne(dto.commercial_entity_id);

      // IMPORTANTE: asignar la entidad, NO el Promise
      (maker as any).commercial_entity = commercial;
    }

    // Si se pasan datos de la entidad comercial → actualizamos la asociada
    if (dto.commercial_entity) {
      const commercial = await maker.commercial_entity; // resolver lazy
      await this.ceService.update(commercial.id, dto.commercial_entity);
    }

    await this.makerRepository.save(maker);
    return { message: 'Maker updated successfully' };
  }

  async remove(id: number) {
    const maker = await this.makerRepository.findOne({ where: { id } });
    if (!maker) throw new NotFoundException('Maker not found');

    await this.makerRepository.remove(maker);
    return { message: 'Maker deleted successfully' };
  }
}
