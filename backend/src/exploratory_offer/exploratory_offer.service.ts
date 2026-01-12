import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExploratoryOfferEntity } from './exploratory_offer.entity';
import { EvaluationProcessEntity } from 'src/evaluation_process/evaluation_process.entity';
import { SupplierPurchaseEntity } from 'src/supplier_purchase/supplier_purchase.entity';
import { CreateExploratoryOfferDto, UpdateExploratoryOfferDto, ExploratoryOfferResponseDto } from './dtos';
import { toDto } from 'src/common/utils/mapper.util';

@Injectable()
export class ExploratoryOfferService {
  constructor(
    @InjectRepository(ExploratoryOfferEntity)
    private readonly exploratoryOfferRepository: Repository<ExploratoryOfferEntity>,

    @InjectRepository(EvaluationProcessEntity)
    private readonly evaluationProcessRepository: Repository<EvaluationProcessEntity>,

    @InjectRepository(SupplierPurchaseEntity)
    private readonly supplierPurchaseRepository: Repository<SupplierPurchaseEntity>,
  ) {}

  async create(dto: CreateExploratoryOfferDto): Promise<{ message: string; data: ExploratoryOfferEntity }> {
    const evaluation_process = await this.evaluationProcessRepository.findOne({ where: { id: dto.evaluation_process_id } });
    if (!evaluation_process) throw new NotFoundException('Evaluation Process not found');

    const reference_purchase = await this.supplierPurchaseRepository.findOne({ where: { id: dto.reference_purchase_id } });
    if (!reference_purchase) throw new NotFoundException('Supplier Purchase not found');

    const offer = this.exploratoryOfferRepository.create({
      evaluation_process,
      offered_price: dto.offered_price,
      reference_purchase,
      price_difference: dto.price_difference,
      percentage_difference: dto.percentage_difference,
      analysis_date: dto.analysis_date,
      is_competitive: dto.is_competitive
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
      relations: [
        'evaluation_process',
        'reference_purchase',
        'exploratory_offer_observs',
        'exploratory_offer_observs.observation',
      ],
    });

    return Promise.all(
      offers.map((offer) => this.toResponseDto(offer)),
    );
  }

  async findOne(id: number): Promise<ExploratoryOfferResponseDto> {
    const offer = await this.exploratoryOfferRepository.findOne({
      where: { id },
      relations: [
        'evaluation_process',
        'reference_purchase',
        'exploratory_offer_observs',
        'exploratory_offer_observs.observation',
      ],
    });

    if (!offer) throw new NotFoundException('Exploratory Offer not found');

    return this.toResponseDto(offer);
  }

  private async toResponseDto(entity: ExploratoryOfferEntity): Promise<ExploratoryOfferResponseDto> {
    return toDto(ExploratoryOfferResponseDto, entity);
  }

  async update(id: number, dto: UpdateExploratoryOfferDto) {
    const offer = await this.exploratoryOfferRepository.findOne({
      where: { id },
      relations: ['evaluation_process', 'reference_purchase'],
    });

    if (!offer) {
      throw new NotFoundException('Exploratory Offer not found');
    }

    if (dto.evaluation_process_id) {
      const evaluation_process = await this.evaluationProcessRepository.findOne({ where: { id: dto.evaluation_process_id } });
      if (!evaluation_process) throw new NotFoundException('evaluation Process not found');
      offer.evaluation_process = evaluation_process;
    }

    if (dto.reference_purchase_id) {
      const reference_purchase = await this.supplierPurchaseRepository.findOne({ where: { id: dto.reference_purchase_id } });
      if (!reference_purchase) throw new NotFoundException('Supplier Purchase not found');
      offer.reference_purchase = reference_purchase;
    }

    if (dto.offered_price !== undefined) {
      offer.offered_price = dto.offered_price;
    } 

    if (dto.price_difference !== undefined) {
      offer.price_difference = dto.price_difference;
    } 

    if (dto.percentage_difference !== undefined) {
      offer.percentage_difference = dto.percentage_difference;
    } 

    if (dto.analysis_date !== undefined) {
      offer.analysis_date = dto.analysis_date;
    }

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

    await this.exploratoryOfferRepository.remove(offer);

    return { message: 'Exploratory Offer deleted successfully' };
  }
}
