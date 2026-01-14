import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationProductEntity } from './application_product.entity';
import { ApplicationEntity } from '../application/application.entity';
import { ProductEntity } from '../product/product.entity';
import { CreateApplicationProductDto } from './dtos/create-application_product-dto';
import { ApplicationProductResponseDto } from './dtos/application_product-response.dto';
import { toDto } from 'src/common/utils/mapper.util';
import { UpdateApplicationProductDto } from './dtos/update-application_product-dto';

@Injectable()
export class ApplicationProductService {
  constructor(
    @InjectRepository(ApplicationProductEntity)
    private readonly appProductRepository: Repository<ApplicationProductEntity>,

    @InjectRepository(ApplicationEntity)
    private readonly applicationRepository: Repository<ApplicationEntity>,

    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async create(dto: CreateApplicationProductDto): Promise<{ message: string; data: ApplicationProductEntity }> {
    const application = await this.applicationRepository.findOne({ where: { id: dto.application_id } });
    if (!application) throw new NotFoundException('Application not found');

    const product = await this.productRepository.findOne({ where: { id: dto.product_id } });
    if (!product) throw new NotFoundException('Product not found');

    const appProduct = this.appProductRepository.create({
      application,
      product,
    });

    const created = await this.appProductRepository.save(appProduct);
    
    return { 
      message: 'Application Product created successfully',
      data: created,
    }
  }

  async findAll(limit = 100, offset = 0): Promise<ApplicationProductResponseDto[]> {
    const appProducts = await this.appProductRepository.find({
      take: limit,
      skip: offset,
      relations: [
        'application',
        'product',   
      ],
    });

    return Promise.all(
      appProducts.map(async (ap) => this.toResponseDto(ap)),
    );
  }

  async findOne(id: number): Promise<ApplicationProductResponseDto> {
    const appProduct = await this.appProductRepository.findOne({ 
      where: { id }, 
      relations: [
        'application',
        'product',
      ] });
    if (!appProduct) throw new NotFoundException('Application Product not found');
    
    return this.toResponseDto(appProduct);
  }

  private async toResponseDto(entity: ApplicationProductEntity): Promise<ApplicationProductResponseDto> {
    return toDto(ApplicationProductResponseDto, entity);
  }

  async update(id: number, dto: UpdateApplicationProductDto) {
    const appProduct = await this.appProductRepository.findOne({
      where: { id },
      relations: ['application', 'product'],
    });

    if (!appProduct) {
      throw new NotFoundException('Application Product not found');
    }

    if (dto.application_id) {
      const application = await this.applicationRepository.findOne({ where: { id: dto.application_id } });
      if (!application) throw new NotFoundException('Application not found');
      appProduct.application = application;
    }

    if (dto.product_id) {
      const product = await this.productRepository.findOne({ where: { id: dto.product_id } });
      if (!product) throw new NotFoundException('Product not found');
      appProduct.product = product;
    }

    await this.appProductRepository.save(appProduct);

    return { message: 'Application Product updated successfully' };
  }

  async remove(id: number): Promise<{ message: string }> {
    const appProduct = await this.appProductRepository.findOne({
      where: { id },
    });

    if (!appProduct) {
      throw new NotFoundException('Application Product not found');
    }

    await this.appProductRepository.remove(appProduct);

    return { message: 'Application Product deleted successfully' };
  }
}
