import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IndustrialEvaluationEntity } from './industrial_evaluation.entity';
import { CreateIndustrialEvaluationDto, IndustrialEvaluationResponseDto, UpdateIndustrialEvaluationDto } from './dtos';
import { IndustrialPurchaseEntity } from '../industrial_purchase/industrial_purchase.entity';
import { toDto } from 'src/common/utils/mapper.util';

@Injectable()
export class IndustrialEvaluationService {
  constructor(
    @InjectRepository(IndustrialEvaluationEntity)
    private readonly industrialEvaluationRepository: Repository<IndustrialEvaluationEntity>,

    @InjectRepository(IndustrialPurchaseEntity)
    private readonly industrialPurchaseRepository: Repository<IndustrialPurchaseEntity>,
  ) {}

  async create(dto: CreateIndustrialEvaluationDto): Promise<{ message: string; data: IndustrialEvaluationEntity }> {
    const industrial_purchase = await this.industrialPurchaseRepository.findOne({ where: { id: dto.industrial_purchase_id } });
    if (!industrial_purchase) throw new NotFoundException('Industrial Purchase not found');

    const evaluation = this.industrialEvaluationRepository.create({
      industrial_purchase,
      send_batch_date: dto.send_batch_date,
      reception_batch_date: dto.reception_batch_date,
      analysis_result: dto.analysis_result,
      report_delivery_date: dto.report_delivery_date
    });

    const created = await this.industrialEvaluationRepository.save(evaluation);
    
    return { 
      message: 'Industrial Evaluation created successfully',
      data: created,
    }
  }

  async findAll(limit = 100, offset = 0): Promise<IndustrialEvaluationResponseDto[]> {
    const evaluations = await this.industrialEvaluationRepository.find({
      take: limit,
      skip: offset,
      relations: [
        'industrial_purchase',
        'industrial_evaluation_observs',
        'industrial_evaluation_observs.observation',
      ],
    });

    return Promise.all(
      evaluations.map((e) => this.toResponseDto(e)),
    );
  }

  async findOne(id: number): Promise<IndustrialEvaluationResponseDto> {
    const evaluation = await this.industrialEvaluationRepository.findOne({
      where: { id },
      relations: [
        'industrial_purchase',
        'industrial_evaluation_observs',
        'industrial_evaluation_observs.observation',
      ],
    });

    if (!evaluation) throw new NotFoundException('Industrial Evaluation not found');

    return this.toResponseDto(evaluation);
  }

  private async toResponseDto(entity: IndustrialEvaluationEntity): Promise<IndustrialEvaluationResponseDto> {
    return toDto(IndustrialEvaluationResponseDto, entity);
  }

  async update(id: number, dto: UpdateIndustrialEvaluationDto) {
    const evaluation = await this.industrialEvaluationRepository.findOne({
      where: { id },
      relations: ['industrial_evaluation'],
    });

    if (!evaluation) {
      throw new NotFoundException('Industrial Evaluation not found');
    }

    if (dto.industrial_purchase_id) {
      const industrial_purchase = await this.industrialPurchaseRepository.findOne({ where: { id: dto.industrial_purchase_id } });
      if (!industrial_purchase) throw new NotFoundException('Industrial Purchase not found');
      evaluation.industrial_purchase = industrial_purchase;
    }

    if (dto.send_batch_date !== undefined) {
      evaluation.send_batch_date = dto.send_batch_date;
    }

    if (dto.reception_batch_date !== undefined) {
      evaluation.reception_batch_date = dto.reception_batch_date;
    }

    if (dto.analysis_result !== undefined) {
      evaluation.analysis_result = dto.analysis_result;
    }

    if (dto.report_delivery_date !== undefined) {
      evaluation.report_delivery_date = dto.report_delivery_date;
    }

    await this.industrialEvaluationRepository.save(evaluation);

    return { message: 'Industrial Evaluation updated successfully' };
  }

  async remove(id: number): Promise<{ message: string }> {
    const evaluation = await this.industrialEvaluationRepository.findOne({
      where: { id },
    });

    if (!evaluation) {
      throw new NotFoundException('Industrial Evaluation not found');
    }

    await this.industrialEvaluationRepository.remove(evaluation);

    return { message: 'Industrial Evaluation deleted successfully' };
  }
}
