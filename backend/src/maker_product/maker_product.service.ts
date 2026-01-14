import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MakerProductEntity } from './maker_product.entity';
import { ProductEntity } from '../product/product.entity';
import { CommercialEntityEntity } from '../commercial_entity/commercial_entity.entity';
import { CommercialEntityService } from '../commercial_entity/commercial_entity.service';
import { CreateMakerProductDto, UpdateMakerProductDto, MakerProductResponseDto } from './dtos';
import { toDto } from 'src/common/utils/mapper.util';
import { EntityRoleEnum} from 'src/enums';

@Injectable()
export class MakerProductService {
  constructor(
    @InjectRepository(MakerProductEntity)
    private readonly makerProductRepository: Repository<MakerProductEntity>,

    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    @InjectRepository(CommercialEntityEntity)
    private readonly makerRepository: Repository<CommercialEntityEntity>,

    private readonly commercialEntityService: CommercialEntityService,
  ) {}

  async create(dto: CreateMakerProductDto): Promise<{ message: string; data: Promise<MakerProductResponseDto> }> {
    const product = await this.productRepository.findOne({ where: { id: dto.product_id } });
    if (!product) throw new NotFoundException('Product not found');

    const maker_entity = await this.makerRepository.findOne({ 
      where: { id: dto.maker_entity_id }, 
      relations: ['roles']
    });
    if (!maker_entity) throw new NotFoundException('Maker not found');

    // ✅ Asegura que la CommercialEntity tenga el rol MAKER
    await this.commercialEntityService.ensureRole(maker_entity.id, EntityRoleEnum.F);

    const mp = this.makerProductRepository.create({
      product,
      maker_entity,
    });

    const saved = await this.makerProductRepository.save(mp);

    return {
      message: 'MakerProduct created successfully',
      data: this.toResponseDto(saved),
    };
  }

  async findAll(limit = 100, offset = 0): Promise<MakerProductResponseDto[]> {
    const makerProducts = await this.makerProductRepository.find({
      take: limit,
      skip: offset,
      relations: ['product', 'maker_entity'],
    });

    return Promise.all(
      makerProducts.map(async (mp) => this.toResponseDto(mp)),
    );
  }

  async findOne(id: number): Promise<MakerProductResponseDto> {
    const mp = await this.makerProductRepository.findOne({ where: { id }, relations: ['product', 'maker_entity'] });
    if (!mp) throw new NotFoundException('Maker_Product not found');
    
    return this.toResponseDto(mp);
  }

  private async toResponseDto(entity: MakerProductEntity): Promise<MakerProductResponseDto> {
    return toDto(MakerProductResponseDto, entity);
  }

  async update(id: number, dto: UpdateMakerProductDto): Promise<{ message: string }> {
    const mp = await this.makerProductRepository.findOne({
      where: { id },
      relations: ['product', 'maker_entity', 'maker_entity.roles'],
    });

    if (!mp) throw new NotFoundException('Maker_Product not found');

    // Actualizar product
    if (dto.product_id && dto.product_id !== mp.product.id) {
      const product = await this.productRepository.findOne({ where: { id: dto.product_id } });
      if (!product) throw new NotFoundException('Product not found');
      mp.product = product;
    }

    // Actualizar maker_entity
    if (dto.maker_entity_id && dto.maker_entity_id !== mp.maker_entity.id) {
      const oldMaker = mp.maker_entity;

      const newMaker = await this.makerRepository.findOne({
        where: { id: dto.maker_entity_id },
        relations: ['roles'],
      });
      if (!newMaker) throw new NotFoundException('New Maker not found');

      // Asegurar rol MAKER
      await this.commercialEntityService.ensureRole(newMaker.id, EntityRoleEnum.F);

      mp.maker_entity = newMaker;
      await this.makerProductRepository.save(mp);

      // Revisar si el antiguo maker aún tiene MakerProducts
      const otherProducts = await this.makerProductRepository.count({
        where: { maker_entity: { id: oldMaker.id } },
      });

      if (otherProducts === 0) {
        const remainingRoles = oldMaker.roles
          .map(r => r.role_type)
          .filter(r => r !== EntityRoleEnum.F);
        await this.commercialEntityService.changeRoles(oldMaker.id, remainingRoles);
      }
    } else {
      await this.makerProductRepository.save(mp);
    }

    return { message: 'MakerProduct updated successfully' };
  }

  async remove(id: number): Promise<{ message: string }> {
    const mp = await this.makerProductRepository.findOne({
      where: { id },
      relations: ['maker_entity', 'maker_entity.roles'],
    });

    if (!mp) throw new NotFoundException('Maker_Product not found');

    const oldMaker = mp.maker_entity;

    await this.makerProductRepository.remove(mp);

    // Revisar si el antiguo maker tiene otros MakerProducts
    const otherProducts = await this.makerProductRepository.count({
      where: { maker_entity: { id: oldMaker.id } },
    });

    if (otherProducts === 0) {
      const remainingRoles = oldMaker.roles
        .map(r => r.role_type)
        .filter(r => r !== EntityRoleEnum.F);
      await this.commercialEntityService.changeRoles(oldMaker.id, remainingRoles);
    }

    return { message: 'MakerProduct deleted successfully' };
  }
}
