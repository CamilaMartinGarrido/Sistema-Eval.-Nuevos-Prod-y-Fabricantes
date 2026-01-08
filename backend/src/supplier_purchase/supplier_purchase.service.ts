import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupplierPurchaseEntity } from './supplier_purchase.entity';
import { ProductEntity } from '../product/product.entity';
import { CommercialEntityEntity } from '../commercial_entity/commercial_entity.entity';
import { CreateSupplierPurchaseDto, SupplierPurchaseResponseDto, UpdateSupplierPurchaseDto } from './dtos';
import { toDto } from 'src/common/utils/mapper.util';

@Injectable()
export class SupplierPurchaseService {
  constructor(
    @InjectRepository(SupplierPurchaseEntity)
    private readonly supplierPurchaseRepository: Repository<SupplierPurchaseEntity>,

    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    @InjectRepository(CommercialEntityEntity)
    private readonly entityRepository: Repository<CommercialEntityEntity>,
  ) {}

  async create(dto: CreateSupplierPurchaseDto): Promise<{ message: string; data: SupplierPurchaseEntity }> {
    const product = await this.productRepository.findOne({ where: { id: dto.product_id } });
    if (!product) throw new NotFoundException('Product not found');

    const supplier = await this.entityRepository.findOne({ where: { id: dto.supplier_id } });
    if (!supplier) throw new NotFoundException('Supplier not found');

    const purchase = this.supplierPurchaseRepository.create({
      product,
      supplier,
      unit_price: dto.unit_price,
      purchase_date: dto.purchase_date
    });

    const created = await this.supplierPurchaseRepository.save(purchase);
    
    return { 
      message: 'Supplier Purchase created successfully',
      data: created,
    }
  }

  async findAll(limit = 100, offset = 0): Promise<SupplierPurchaseResponseDto[]> {
    const purchases = await this.supplierPurchaseRepository.find({
      take: limit,
      skip: offset,
      relations: [
        'product',
        'supplier',
      ],
    });

    return Promise.all(
      purchases.map((p) => this.toResponseDto(p)),
    );
  }

  async findOne(id: number): Promise<SupplierPurchaseResponseDto> {
    const purchase = await this.supplierPurchaseRepository.findOne({
      where: { id },
      relations: [
        'product',
        'supplier',
      ],
    });

    if (!purchase) throw new NotFoundException('Supplier Purchase not found');

    return this.toResponseDto(purchase);
  }

  private async toResponseDto(entity: SupplierPurchaseEntity): Promise<SupplierPurchaseResponseDto> {
    return toDto(SupplierPurchaseResponseDto, entity);
  }

  async update(id: number, dto: UpdateSupplierPurchaseDto) {
    const purchase = await this.supplierPurchaseRepository.findOne({
      where: { id },
      relations: ['product', 'supplier'],
    });

    if (!purchase) {
      throw new NotFoundException('Supplier Purchase not found');
    }

    if (dto.product_id) {
      const product = await this.productRepository.findOne({ where: { id: dto.product_id } });
      if (!product) throw new NotFoundException('Product not found');
      purchase.product = product;
    }

    if (dto.supplier_id) {
      const supplier = await this.entityRepository.findOne({ where: { id: dto.supplier_id } });
      if (!supplier) throw new NotFoundException('Supplier not found');
      purchase.supplier = supplier;
    }

    if (dto.unit_price !== undefined) {
      purchase.unit_price = dto.unit_price;
    } 

    if (dto.purchase_date !== undefined) {
      purchase.purchase_date = dto.purchase_date;
    }

    await this.supplierPurchaseRepository.save(purchase);

    return { message: 'Supplier Purchase updated successfully' };
  }

  async remove(id: number): Promise<{ message: string }> {
    const purchase = await this.supplierPurchaseRepository.findOne({
      where: { id },
    });

    if (!purchase) {
      throw new NotFoundException('Supplier Purchase not found');
    }

    await this.supplierPurchaseRepository.remove(purchase);

    return { message: 'Supplier Purchase deleted successfully' };
  }
}
