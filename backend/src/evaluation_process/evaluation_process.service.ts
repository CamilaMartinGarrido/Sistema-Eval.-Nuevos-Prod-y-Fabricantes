import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EvaluationProcessEntity } from './evaluation_process.entity';
import { ApplicationEntity } from '../application/application.entity';
import { SupplyEntity } from '../supply/supply.entity';
import { CreateEvaluationProcessDto, EvaluationProcessResponseDto, UpdateEvaluationProcessDto } from './dtos';
import { toDto } from 'src/common/utils/mapper.util';

@Injectable()
export class EvaluationProcessService {
  constructor(
    @InjectRepository(EvaluationProcessEntity)
    private readonly evaluationRepository: Repository<EvaluationProcessEntity>,

    @InjectRepository(ApplicationEntity)
    private readonly appRepository: Repository<ApplicationEntity>,

    @InjectRepository(SupplyEntity)
    private readonly supplyRepository: Repository<SupplyEntity>,
  ) {}

  async create(dto: CreateEvaluationProcessDto): Promise<{ message: string; data: EvaluationProcessEntity }> {
    const application = await this.appRepository.findOne({ where: { id: dto.application_id } });
    if (!application) throw new NotFoundException('Application not found');
            
    const supply = await this.supplyRepository.findOne({ where: { id: dto.supply_id } });
    if (!supply) throw new NotFoundException('Supply not found');
            
    const evaluation_process = this.evaluationRepository.create({
      application,
      supply,
    });
        
    const saved = await this.evaluationRepository.save(evaluation_process);
        
    return {
      message: 'Evaluation Process created successfully',
      data: saved,
    }
  }

  async findAll(limit = 100, offset = 0): Promise<EvaluationProcessResponseDto[]> {
    const evaluations = await this.evaluationRepository.find({
      take: limit,
      skip: offset,
      relations: ['application', 'supply'],
    });
  
    return Promise.all(
      evaluations.map(async (evaluation) => this.toResponseDto(evaluation)),
    );
  }

  async findOne(id: number): Promise<EvaluationProcessResponseDto> {
    const evaluation = await this.evaluationRepository.findOne({ where: { id }, relations: ['application', 'supply'] });
    if (!evaluation) {
      throw new NotFoundException('Evaluation Process not found');
    }
    
    return this.toResponseDto(evaluation);
  }

  private async toResponseDto(entity: EvaluationProcessEntity): Promise<EvaluationProcessResponseDto> {
    return toDto(EvaluationProcessResponseDto, entity);
  }

  async update(id: number, dto: UpdateEvaluationProcessDto): Promise<{ message: string }> {
    const evaluation = await this.evaluationRepository.findOne({
      where: { id },
      relations: ['application', 'supply'],
    });

    if (!evaluation) {
      throw new NotFoundException('Evaluation Process not found');
    }

    if (dto.application_id) {
      const application = await this.appRepository.findOne({ where: { id: dto.application_id } });
      if (!application) throw new NotFoundException('Application not found');
      evaluation.application = application;
    }

    if (dto.supply_id) {
      const supply = await this.supplyRepository.findOne({ where: { id: dto.supply_id } });
      if (!supply) throw new NotFoundException('Supply not found');
      evaluation.supply = supply;
    }

    const updated = await this.evaluationRepository.save(evaluation);

    return { message: 'Evaluation Process updated successfully' };
  }

  async remove(id: number): Promise<{ message: string }> {
    const evaluation = await this.evaluationRepository.findOne({
      where: { id },
    });

    if (!evaluation) {
      throw new NotFoundException('Evaluation Process not found');
    }

    await this.evaluationRepository.remove(evaluation);

    return { message: 'Evaluation Process deleted successfully' };
  }
}
