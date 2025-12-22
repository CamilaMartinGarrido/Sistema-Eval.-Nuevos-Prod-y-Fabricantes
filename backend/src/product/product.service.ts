import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './product.entity';
import { CreateProductDto, UpdateProductDto, ProductResponseDto } from './dtos';
import { toDto } from 'src/common/utils/mapper.util';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async create(dto: CreateProductDto): Promise<{ message: string; data: ProductEntity }> {
    const product = this.productRepository.create(dto);
    const created = await this.productRepository.save(product);
    
    return { 
      message: 'Product created successfully',
      data: created,
    };
  }

  async findAll(limit = 100, offset = 0) {
    const products = await this.productRepository.find({ take: limit, skip: offset });

    return Promise.all(
      products.map(async (a: ProductEntity) => this.toResponseDto(a)),
    );
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this.toResponseDto(product);
  }

  private async toResponseDto(entity: ProductEntity): Promise<ProductResponseDto> {
    return toDto(ProductResponseDto, entity);
  }

  async update(id: number, dto: UpdateProductDto) {
    const result = await this.productRepository.update(id, dto);
    if (result.affected === 0) {
      throw new NotFoundException('Product could not be updated');
    }
    return { message: 'Product updated successfully' };
  }

  async remove(id: number) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    await this.productRepository.remove(product);
    return { message: 'Product deleted successfully' };
  }
}
