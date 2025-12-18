import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MakerProductEntity } from './maker_product.entity';
import { ProductEntity } from '../product/product.entity';
import { MakerEntity } from '../maker/maker.entity';
import { CreateMakerProductDto, UpdateMakerProductDto, MakerProductResponseDto } from './dtos';
import { toDto } from 'src/common/utils/mapper.util';

@Injectable()
export class MakerProductService {
  constructor(
    @InjectRepository(MakerProductEntity)
    private readonly makerProductRepository: Repository<MakerProductEntity>,

    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    @InjectRepository(MakerEntity)
    private readonly makerRepository: Repository<MakerEntity>,
  ) {}

  async create(dto: CreateMakerProductDto): Promise<{ message: string; data: MakerProductEntity }> {
    const product = await this.productRepository.findOne({ where: { id: dto.product_id } });
    if (!product) throw new NotFoundException('Product not found');
    
    const maker = await this.makerRepository.findOne({ where: { id: dto.maker_id } });
    if (!maker) throw new NotFoundException('Maker not found');
    
    const mp = this.makerProductRepository.create({
      product,
      maker,
    });

    const saved = await this.makerProductRepository.save(mp);

    return {
      message: 'MakerProduct created successfully',
      data: saved,
    }
  }

  async findAll(limit = 100, offset = 0): Promise<MakerProductResponseDto[]> {
    const makerProducts = await this.makerProductRepository.find({
      take: limit,
      skip: offset,
      relations: ['product', 'maker'],
    });

    return Promise.all(
      makerProducts.map(async (mp) => this.toResponseDto(mp)),
    );
  }

  async findOne(id: number): Promise<MakerProductResponseDto> {
    const mp = await this.makerProductRepository.findOne({ where: { id }, relations: ['product', 'maker'] });
    if (!mp) throw new NotFoundException('Maker_Product not found');
    
    return this.toResponseDto(mp);
  }

  private async toResponseDto(entity: MakerProductEntity): Promise<MakerProductResponseDto> {
    return toDto(MakerProductResponseDto, entity);
  }
  
  async update(id: number, dto: UpdateMakerProductDto): Promise<{ message: string }> {
    const mp = await this.makerProductRepository.findOne({
      where: { id },
      relations: ['product', 'maker'],
    });

    if (!mp) {
      throw new NotFoundException('Maker_Product not found');
    }

    // Cambiar product si viene product_id 
    if (dto.product_id) {
      const product = await this.productRepository.findOne({ where: { id: dto.product_id } });
      if (!product) throw new NotFoundException('Product not found');
      mp.product = product;
    }

    // Cambiar maker si viene maker_id
    if (dto.maker_id) {
      const maker = await this.makerRepository.findOne({ where: { id: dto.maker_id } });
      if (!maker) throw new NotFoundException('Maker not found');
      mp.maker = maker;
    }

    const updated = await this.makerProductRepository.save(mp);

    return { message: 'MakerProduct updated successfully' };
  }

  async remove(id: number): Promise<{ message: string }> {
    const mp = await this.makerProductRepository.findOne({
      where: { id },
    });

    if (!mp) {
      throw new NotFoundException('Maker_Product not found');
    }

    // Eliminar solo el Maker_Product, sin tocar maker ni product
    await this.makerProductRepository.remove(mp);

    return { message: 'Maker_Product deleted successfully' };
  }
}
