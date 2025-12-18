import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExploratoryOfferEntity } from './exploratory_offer.entity';
import { SupplyEntity } from 'src/supply/supply.entity';
import { CreateExploratoryOfferDto, UpdateExploratoryOfferDto, ExploratoryOfferResponseDto } from './dtos';
import { toDto } from 'src/common/utils/mapper.util';

@Injectable()
export class ExploratoryOfferService {
  constructor(
    @InjectRepository(ExploratoryOfferEntity)
    private readonly exploratoryOfferRepository: Repository<ExploratoryOfferEntity>,

    @InjectRepository(SupplyEntity)
    private readonly supplyRepository: Repository<SupplyEntity>,
  ) {}

  async create(dto: CreateExploratoryOfferDto): Promise<{ message: string; data: ExploratoryOfferEntity }> {
    const supply = await this.supplyRepository.findOne({ where: { id: dto.supply_id } });
    if (!supply) throw new NotFoundException('Supply not found');

    const offer = this.exploratoryOfferRepository.create({
      supply,
      is_competitive: dto.is_competitive,
    });

    const created = await this.exploratoryOfferRepository.save(offer);
    
    return { 
      message: 'Exploratory Offer created successfully',
      data: created,
    }
  }

  async findAll(limit = 100, offset = 0): Promise<ExploratoryOfferResponseDto[]> {
    const offers = await this.exploratoryOfferRepository.find({
      take: limit,
      skip: offset,
      relations: ['supply'],
    });

    return Promise.all(
      offers.map(async (offer) => this.toResponseDto(offer)),
    );
  }

  async findOne(id: number): Promise<ExploratoryOfferResponseDto> {
    const offer = await this.exploratoryOfferRepository.findOne({ where: { id }, relations: ['supply'] });
    if (!offer) throw new NotFoundException('Exploratory Offer not found');
    
    return this.toResponseDto(offer);
  }

  private async toResponseDto(entity: ExploratoryOfferEntity): Promise<ExploratoryOfferResponseDto> {
    return toDto(ExploratoryOfferResponseDto, entity);
  }

  async update(id: number, dto: UpdateExploratoryOfferDto) {
    const offer = await this.exploratoryOfferRepository.findOne({
      where: { id },
      relations: ['supply'],
    });

    if (!offer) {
      throw new NotFoundException('Exploratory Offer not found');
    }

    // Cambiar supply si viene supply_id (no actualizar sus datos)
    if (dto.supply_id) {
      const supply = await this.supplyRepository.findOne({ where: { id: dto.supply_id } });
      if (!supply) throw new NotFoundException('Supply not found');
      offer.supply = supply;
    }

    // Actualizar SOLO los campos propios de Exploratory Offer
    if (dto.is_competitive !== undefined) {
      offer.is_competitive = dto.is_competitive;
    }

    await this.exploratoryOfferRepository.save(offer);

    return { message: 'Exploratory Offer updated successfully' };
  }

  async remove(id: number): Promise<{ message: string }> {
    const offer = await this.exploratoryOfferRepository.findOne({
      where: { id },
    });

    if (!offer) {
      throw new NotFoundException('Exploratory Offer not found');
    }

    // Eliminar solo la exploratory offer, sin tocar supply
    await this.exploratoryOfferRepository.remove(offer);

    return { message: 'Exploratory Offer deleted successfully' };
  }
}
