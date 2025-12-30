import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SampleEntity } from './sample.entity';
import { SupplyEntity } from '../supply/supply.entity';
import { CreateSampleDto, SampleResponseDto, UpdateSampleDto } from './dtos';
import { toDto } from 'src/common/utils/mapper.util';

@Injectable()
export class SampleService {
  constructor(
    @InjectRepository(SampleEntity)
    private readonly sampleRepository: Repository<SampleEntity>,

    @InjectRepository(SupplyEntity)
    private readonly supplyRepository: Repository<SupplyEntity>,
  ) {}

  async create(dto: CreateSampleDto): Promise<{ message: string; data:SampleEntity }> {
    const supply = await this.supplyRepository.findOne({ where: { id: dto.supply_id } });
    if (!supply) throw new NotFoundException('Supply not found');

    const sample = this.sampleRepository.create({
      supply,
      request_date: dto.request_date,
      send_date_supplier: dto.send_date_supplier,
      date_receipt_warehouse: dto.date_receipt_warehouse,
      date_receipt_client:dto.date_receipt_client,
      quantity: dto.quantity,
      unit: dto.unit,
      sample_code: dto.sample_code
    });

    const created = await this.sampleRepository.save(sample);
    
    return { 
      message: 'Sample created successfully',
      data: created,
    }
  }

  async findAll(limit = 100, offset = 0): Promise<SampleResponseDto[]> {
    const samples = await this.sampleRepository.find({
      take: limit,
      skip: offset,
      relations: ['supply'],
    });

    return Promise.all(
      samples.map(async (a) => this.toResponseDto(a)),
    );
  }

  async findOne(id: number): Promise<SampleResponseDto> {
    const sample = await this.sampleRepository.findOne({ 
      where: { id }, 
      relations: ['supply'] 
    });

    if (!sample) throw new NotFoundException('Sample not found');
    
    return this.toResponseDto(sample);
  }

  private async toResponseDto(entity: SampleEntity): Promise<SampleResponseDto> {
    return toDto(SampleResponseDto, entity);
  }

  async update(id: number, dto: UpdateSampleDto) {
    const sample = await this.sampleRepository.findOne({
      where: { id },
      relations: ['supply'],
    });

    if (!sample) {
      throw new NotFoundException('Sample not found');
    }

    if (dto.supply_id) {
      const supply = await this.supplyRepository.findOne({ where: { id: dto.supply_id } });
      if (!supply) throw new NotFoundException('Supply not found');
      sample.supply = supply;
    }

    if (dto.request_date !== undefined) {
      sample.request_date = dto.request_date;
    }

    if (dto.send_date_supplier !== undefined) {
      sample.send_date_supplier = dto.send_date_supplier;
    }

    if (dto.date_receipt_warehouse !== undefined) {
      sample.date_receipt_warehouse = dto.date_receipt_warehouse;
    }

    if (dto.date_receipt_client !== undefined) {
      sample.date_receipt_client = dto.date_receipt_client;
    }

    if (dto.quantity !== undefined) {
      sample.quantity = dto.quantity;
    }

    if (dto.unit !== undefined) {
      sample.unit = dto.unit;
    }

    if (dto.sample_code !== undefined) {
      sample.sample_code = dto.sample_code;
    }

    await this.sampleRepository.save(sample);

    return { message: 'Sample updated successfully' };
  }

  async remove(id: number): Promise<{ message: string }> {
    const sample = await this.sampleRepository.findOne({
      where: { id },
    });

    if (!sample) {
      throw new NotFoundException('Sample not found');
    }

    await this.sampleRepository.remove(sample);

    return { message: 'Sample deleted successfully' };
  }
}
