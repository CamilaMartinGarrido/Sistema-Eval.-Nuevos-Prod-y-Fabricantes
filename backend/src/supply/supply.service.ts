import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupplyEntity } from './supply.entity';
import { MakerProductEntity } from '../maker_product/maker_product.entity';
import { CommercialEntityEntity } from '../commercial_entity/commercial_entity.entity';
import { CommercialEntityService } from '../commercial_entity/commercial_entity.service';
import { CreateSupplyDto, UpdateSupplyDto, SupplyResponseDto } from './dtos';
import { toDto } from 'src/common/utils/mapper.util';
import { RoleEnum } from 'src/enums';

@Injectable()
export class SupplyService {
  constructor(
    @InjectRepository(SupplyEntity)
    private readonly supplyRepository: Repository<SupplyEntity>,

    @InjectRepository(CommercialEntityEntity)
    private readonly supplierRepository: Repository<CommercialEntityEntity>,

    @InjectRepository(MakerProductEntity)
    private readonly mpRepository: Repository<MakerProductEntity>,

    private readonly commercialEntityService: CommercialEntityService,
  ) {}

  async create(dto: CreateSupplyDto): Promise<{ message: string; data: Promise<SupplyResponseDto> }> {
    const supplier_entity = await this.supplierRepository.findOne({ 
      where: { id: dto.supplier_entity_id }, 
      relations: ['roles'] 
    });
    if (!supplier_entity) throw new NotFoundException('Supplier not found');

    // ✅ Asegura que la CommercialEntity tenga el rol SUPPLIER
    await this.commercialEntityService.ensureRole(supplier_entity.id, RoleEnum.S);

    const maker_product = await this.mpRepository.findOne({ where: { id: dto.maker_product_id } });
    if (!maker_product) throw new NotFoundException('MakerProduct not found');

    const supply = this.supplyRepository.create({
      supplier_entity,
      maker_product,
    });

    const saved = await this.supplyRepository.save(supply);

    return {
      message: 'Supply created successfully',
      data: this.toResponseDto(saved),
    };
  }

  async findAll(limit = 100, offset = 0): Promise<SupplyResponseDto[]> {
    const supplies = await this.supplyRepository.find({
      take: limit,
      skip: offset,
      relations: ['supplier_entity', 'maker_product'],
    });

    return Promise.all(
      supplies.map(async (supply) => this.toResponseDto(supply)),
    );
  }

  async findOne(id: number): Promise<SupplyResponseDto> {
    const supply = await this.supplyRepository.findOne({ where: { id }, relations: ['supplier_entity', 'maker_product'] });
    if (!supply) throw new NotFoundException('Supply not found');
    
    return this.toResponseDto(supply);
  }

  private async toResponseDto(entity: SupplyEntity): Promise<SupplyResponseDto> {
    return toDto(SupplyResponseDto, entity);
  }

  async update(id: number, dto: UpdateSupplyDto): Promise<{ message: string }> {
    const supply = await this.supplyRepository.findOne({
      where: { id },
      relations: ['supplier_entity', 'supplier_entity.roles', 'maker_product'],
    });

    if (!supply) throw new NotFoundException('Supply not found');

    // Actualizar maker_product
    if (dto.maker_product_id) {
      const maker_product = await this.mpRepository.findOne({ where: { id: dto.maker_product_id } });
      if (!maker_product) throw new NotFoundException('MakerProduct not found');
      supply.maker_product = maker_product;
    }

    // Actualizar supplier_entity
    if (dto.supplier_entity_id && dto.supplier_entity_id !== supply.supplier_entity.id) {
      const oldSupplier = supply.supplier_entity;

      const newSupplier = await this.supplierRepository.findOne({
        where: { id: dto.supplier_entity_id },
        relations: ['roles'],
      });
      if (!newSupplier) throw new NotFoundException('Supplier not found');

      // Asegurar rol SUPPLIER
      await this.commercialEntityService.ensureRole(newSupplier.id, RoleEnum.S);

      supply.supplier_entity = newSupplier;

      // Revisar si el antiguo supplier tiene otros supplies
      const otherSupplies = await this.supplyRepository.count({
        where: { supplier_entity: { id: oldSupplier.id } },
      });

      if (otherSupplies === 0) {
        const remainingRoles = oldSupplier.roles
          .map(r => r.role_type)
          .filter(r => r !== RoleEnum.S); // eliminar solo SUPPLIER
        await this.commercialEntityService.changeRoles(oldSupplier.id, remainingRoles);
      }
    }

    await this.supplyRepository.save(supply);

    return { message: 'Supply updated successfully' };
  }

  async remove(id: number): Promise<{ message: string }> {
    const supply = await this.supplyRepository.findOne({
      where: { id },
      relations: ['supplier_entity', 'supplier_entity.roles'],
    });

    if (!supply) throw new NotFoundException('Supply not found');

    const oldSupplier = supply.supplier_entity;

    await this.supplyRepository.remove(supply);

    // Revisar si el supplier tiene otros supplies
    const otherSupplies = await this.supplyRepository.count({
      where: { supplier_entity: { id: oldSupplier.id } },
    });

    if (otherSupplies === 0) {
      const remainingRoles = oldSupplier.roles
        .map(r => r.role_type)
        .filter(r => r !== RoleEnum.S); // eliminar solo SUPPLIER
      await this.commercialEntityService.changeRoles(oldSupplier.id, remainingRoles);
    }

    return { message: 'Supply deleted successfully' };
  }
}
