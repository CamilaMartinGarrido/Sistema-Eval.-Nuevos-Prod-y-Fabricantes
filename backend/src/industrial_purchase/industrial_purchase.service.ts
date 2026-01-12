import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IndustrialPurchaseEntity } from './industrial_purchase.entity';
import { EvaluationProcessEntity } from '../evaluation_process/evaluation_process.entity';
import { CreateIndustrialPurchaseDto, IndustrialPurchaseResponseDto, UpdateIndustrialPurchaseDto } from './dtos';
import { toDto } from 'src/common/utils/mapper.util';

@Injectable()
export class IndustrialPurchaseService {
  constructor(
    @InjectRepository(IndustrialPurchaseEntity)
    private readonly industrialPurchaseRepository: Repository<IndustrialPurchaseEntity>,

    @InjectRepository(EvaluationProcessEntity)
    private readonly evaluationProcessRepository: Repository<EvaluationProcessEntity>,
  ) {}

  async create(dto: CreateIndustrialPurchaseDto): Promise<{ message: string; data: IndustrialPurchaseEntity }> {
    const evaluation_process = await this.evaluationProcessRepository.findOne({ where: { id: dto.evaluation_process_id } });
    if (!evaluation_process) throw new NotFoundException('Evaluation Process not found');

    const purchase = this.industrialPurchaseRepository.create({
      evaluation_process,
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
        'evaluation_process',
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
        'evaluation_process',
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
      relations: ['evaluation_process'],
    });

    if (!purchase) {
      throw new NotFoundException('Industrial Purchase not found');
    }

    if (dto.evaluation_process_id) {
      const evaluation_process = await this.evaluationProcessRepository.findOne({ where: { id: dto.evaluation_process_id } });
      if (!evaluation_process) throw new NotFoundException('Evaluation Process not found');
      purchase.evaluation_process = evaluation_process;
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
