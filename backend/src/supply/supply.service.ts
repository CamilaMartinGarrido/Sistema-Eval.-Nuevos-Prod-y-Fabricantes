import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupplyEntity } from './supply.entity';
import { CreateSupplyDto, UpdateSupplyDto, SupplyResponseDto } from './dtos';
import { SupplierEntity } from '../supplier/supplier.entity';
import { MakerProductEntity } from '../maker_product/maker_product.entity';
import { toDto } from 'src/common/utils/mapper.util';

@Injectable()
export class SupplyService {
  constructor(
    @InjectRepository(SupplyEntity)
    private readonly supplyRepository: Repository<SupplyEntity>,

    @InjectRepository(SupplierEntity)
    private readonly supplierRepository: Repository<SupplierEntity>,

    @InjectRepository(MakerProductEntity)
    private readonly mpRepository: Repository<MakerProductEntity>,
  ) {}

  async create(dto: CreateSupplyDto): Promise<{ message: string; data: Promise<SupplyResponseDto> }> {
    const supplier = await this.supplierRepository.findOne({ where: { id: dto.supplier_id } });
    if (!supplier) throw new NotFoundException('Supplier not found');
        
    const maker_product = await this.mpRepository.findOne({ where: { id: dto.maker_product_id } });
    if (!maker_product) throw new NotFoundException('MakerProduct not found');
        
    const supply = this.supplyRepository.create({
      supplier,
      maker_product,
    });
    
    const saved = await this.supplyRepository.save(supply);
    
    return {
      message: 'Supply created successfully',
      data: this.toResponseDto(saved),
    }
  }

  async findAll(limit = 100, offset = 0): Promise<SupplyResponseDto[]> {
    const supplies = await this.supplyRepository.find({
      take: limit,
      skip: offset,
      relations: ['supplier', 'maker_product'],
    });

    return Promise.all(
      supplies.map(async (supply) => this.toResponseDto(supply)),
    );
  }

  async findOne(id: number): Promise<SupplyResponseDto> {
    const supply = await this.supplyRepository.findOne({ where: { id }, relations: ['supplier', 'maker_product'] });
    if (!supply) throw new NotFoundException('Supply not found');
    
    return this.toResponseDto(supply);
  }

  private async toResponseDto(entity: SupplyEntity): Promise<SupplyResponseDto> {
    return toDto(SupplyResponseDto, entity);
  }

  async update(id: number, dto: UpdateSupplyDto): Promise<{ message: string }> {
    const supply = await this.supplyRepository.findOne({
      where: { id },
      relations: ['supplier', 'maker_product'],
    });

    if (!supply) {
      throw new NotFoundException('Supply not found');
    }

    // Cambiar supplier si viene supplier_id
    if (dto.supplier_id) {
      const supplier = await this.supplierRepository.findOne({ where: { id: dto.supplier_id } });
      if (!supplier) throw new NotFoundException('Supplier not found');
      supply.supplier = supplier;
    }

    // Cambiar maker_product si viene maker_product_id 
    if (dto.maker_product_id) {
      const maker_product = await this.mpRepository.findOne({ where: { id: dto.maker_product_id } });
      if (!maker_product) throw new NotFoundException('MakerProduct not found');
      supply.maker_product = maker_product;
    }

    const updated = await this.supplyRepository.save(supply);

    return { message: 'Supply updated successfully' };
  }

  async remove(id: number): Promise<{ message: string }> {
    const supply = await this.supplyRepository.findOne({
      where: { id },
    });

    if (!supply) {
      throw new NotFoundException('Supply not found');
    }

    // Eliminar solo el Supply, sin tocar supplier ni maker_product
    await this.supplyRepository.remove(supply);

    return { message: 'Supply deleted successfully' };
  }
}
