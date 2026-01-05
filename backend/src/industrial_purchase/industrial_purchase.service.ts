import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IndustrialPurchaseEntity } from './industrial_purchase.entity';
import { ClientSupplyEntity } from '../client_supply/client_supply.entity';
import { CreateIndustrialPurchaseDto, IndustrialPurchaseResponseDto, UpdateIndustrialPurchaseDto } from './dtos';
import { toDto } from 'src/common/utils/mapper.util';

@Injectable()
export class IndustrialPurchaseService {
  constructor(
    @InjectRepository(IndustrialPurchaseEntity)
    private readonly industrialPurchaseRepository: Repository<IndustrialPurchaseEntity>,

    @InjectRepository(ClientSupplyEntity)
    private readonly clientSupplyRepository: Repository<ClientSupplyEntity>,
  ) {}

  async create(dto: CreateIndustrialPurchaseDto): Promise<{ message: string; data: IndustrialPurchaseEntity }> {
    const client_supply = await this.clientSupplyRepository.findOne({ where: { id: dto.client_supply_id } });
    if (!client_supply) throw new NotFoundException('Client Supply not found');

    const purchase = this.industrialPurchaseRepository.create({
      client_supply,
      request_date: dto.request_date,
      purchase_status: dto.purchase_status
    });

    const created = await this.industrialPurchaseRepository.save(purchase);
    
    return { 
      message: 'Industrial Purchase created successfully',
      data: created,
    }
  }

  async findAll(limit = 100, offset = 0): Promise<IndustrialPurchaseResponseDto[]> {
    const purchases = await this.industrialPurchaseRepository.find({
      take: limit,
      skip: offset,
      relations: [
        'client_supply',
        'industrial_purchase_observs',
        'industrial_purchase_observs.observation',
      ],
    });

    return Promise.all(
      purchases.map((a) => this.toResponseDto(a)),
    );
  }

  async findOne(id: number): Promise<IndustrialPurchaseResponseDto> {
    const purchase = await this.industrialPurchaseRepository.findOne({
      where: { id },
      relations: [
        'client_supply',
        'industrial_purchase_observs',
        'industrial_purchase_observs.observation',
      ],
    });

    if (!purchase) throw new NotFoundException('Industrial Purchase not found');

    return this.toResponseDto(purchase);
  }

  private async toResponseDto(entity: IndustrialPurchaseEntity): Promise<IndustrialPurchaseResponseDto> {
    return toDto(IndustrialPurchaseResponseDto, entity);
  }

  async update(id: number, dto: UpdateIndustrialPurchaseDto) {
    const purchase = await this.industrialPurchaseRepository.findOne({
      where: { id },
      relations: ['client_supply'],
    });

    if (!purchase) {
      throw new NotFoundException('Industrial Purchase not found');
    }

    if (dto.client_supply_id) {
      const client_supply = await this.clientSupplyRepository.findOne({ where: { id: dto.client_supply_id } });
      if (!client_supply) throw new NotFoundException('Client Supply not found');
      purchase.client_supply = client_supply;
    }

    if (dto.request_date !== undefined) {
      purchase.request_date = dto.request_date;
    }

    if (dto.purchase_status !== undefined) {
      purchase.purchase_status = dto.purchase_status;
    }

    await this.industrialPurchaseRepository.save(purchase);

    return { message: 'Industrial Purchase updated successfully' };
  }

  async remove(id: number): Promise<{ message: string }> {
    const purchase = await this.industrialPurchaseRepository.findOne({
      where: { id },
    });

    if (!purchase) {
      throw new NotFoundException('Industrial Purchase not found');
    }

    await this.industrialPurchaseRepository.remove(purchase);

    return { message: 'Industrial Purchase deleted successfully' };
  }
}
