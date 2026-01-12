import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ManufacturerStatusEntity } from './manufacturer_status.entity';
import { MakerProductEntity } from '../maker_product/maker_product.entity';
import { CreateManufacturerStatusDto, ManufacturerStatusResponseDto, UpdateManufacturerStatusDto } from './dtos';
import { toDto } from 'src/common/utils/mapper.util';

@Injectable()
export class ManufacturerStatusService {
  constructor(
    @InjectRepository(ManufacturerStatusEntity)
    private readonly manufacturerStatusRepository: Repository<ManufacturerStatusEntity>,

    @InjectRepository(MakerProductEntity)
    private readonly makerProductRepository: Repository<MakerProductEntity>,
  ) {}

  async create(dto: CreateManufacturerStatusDto): Promise<{ message: string; data: ManufacturerStatusEntity }> {
    const maker_product = await this.makerProductRepository.findOne({ where: { id: dto.maker_product_id } });
    if (!maker_product) throw new NotFoundException('Maker Product not found');

    const status = this.manufacturerStatusRepository.create({
      maker_product,
      start_date: dto.start_date,
      final_state: dto.final_state,
      end_date: dto.end_date,
    });

    const created = await this.manufacturerStatusRepository.save(status);
    
    return { 
      message: 'Manufacturer Status created successfully',
      data: created,
    }
  }

  async findAll(limit = 100, offset = 0): Promise<ManufacturerStatusResponseDto[]> {
    const states = await this.manufacturerStatusRepository.find({
      take: limit,
      skip: offset,
      relations: ['maker_product'],
    });

    return Promise.all(
      states.map((s) => this.toResponseDto(s)),
    );
  }

  async findOne(id: number): Promise<ManufacturerStatusResponseDto> {
    const status = await this.manufacturerStatusRepository.findOne({
      where: { id },
      relations: ['maker_product'],
    });

    if (!status) throw new NotFoundException('Manufacturer Status not found');

    return this.toResponseDto(status);
  }

  private async toResponseDto(entity: ManufacturerStatusEntity): Promise<ManufacturerStatusResponseDto> {
    return toDto(ManufacturerStatusResponseDto, entity);
  }

  async update(id: number, dto: UpdateManufacturerStatusDto) {
    const status = await this.manufacturerStatusRepository.findOne({
      where: { id },
      relations: ['maker_product'],
    });

    if (!status) {
      throw new NotFoundException('Manufacturer Status not found');
    }

    if (dto.maker_product_id) {
      const maker_product = await this.makerProductRepository.findOne({ where: { id: dto.maker_product_id } });
      if (!maker_product) throw new NotFoundException('Maker Product not found');
      status.maker_product = maker_product;
    }

    if (dto.start_date !== undefined) {
      status.start_date = dto.start_date;
    }

    if (dto.final_state !== undefined) {
      status.final_state = dto.final_state;
    }

    if (dto.end_date !== undefined) {
      status.end_date = dto.end_date;
    }

    await this.manufacturerStatusRepository.save(status);

    return { message: 'Manufacturer Status updated successfully' };
  }

  async remove(id: number): Promise<{ message: string }> {
    const status = await this.manufacturerStatusRepository.findOne({
      where: { id },
    });

    if (!status) {
      throw new NotFoundException('Manufacturer Status not found');
    }

    await this.manufacturerStatusRepository.remove(status);

    return { message: 'Manufacturer Status deleted successfully' };
  }
}
