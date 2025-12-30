import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SampleEvaluationEntity } from './sample_evaluation.entity';
import { ClientSupplyEntity } from '../client_supply/client_supply.entity';
import { SampleAnalysisEntity } from '../sample_analysis/sample_analysis.entity';
import { ClientEntity } from '../client/client.entity';
import { CreateSampleEvaluationDto, SampleEvaluationResponseDto, UpdateSampleEvaluationDto } from './dtos';
import { toDto } from 'src/common/utils/mapper.util';

@Injectable()
export class SampleEvaluationService {
  constructor(
    @InjectRepository(SampleEvaluationEntity)
    private readonly sampleEvaluationRepository: Repository<SampleEvaluationEntity>,

    @InjectRepository(ClientSupplyEntity)
    private readonly clientSupplyRepository: Repository<ClientSupplyEntity>,

    @InjectRepository(SampleAnalysisEntity)
    private readonly sampleAnalysisRepository: Repository<SampleAnalysisEntity>,
    
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
  ) {}

  async create(dto: CreateSampleEvaluationDto): Promise<{ message: string; data: SampleEvaluationEntity }> {
    const client_supply = await this.clientSupplyRepository.findOne({ where: { id: dto.client_supply_id } });
    if (!client_supply) throw new NotFoundException('Client Supply not found');

    const sample_analysis = await this.sampleAnalysisRepository.findOne({ where: { id: dto.sample_analysis_id } });
    if (!sample_analysis) throw new NotFoundException('Sample Analysis not found');

    const source_client = await this.clientRepository.findOne({ where: { id: dto.source_client } });
    if (!source_client) throw new NotFoundException('Client not found');
    
    const evaluation = this.sampleEvaluationRepository.create({
      client_supply,
      sample_analysis,
      self_performed: dto.self_performed,
      source_client,
      decision_continue: dto.decision_continue
    });

    const created = await this.sampleEvaluationRepository.save(evaluation);
    
    return { 
      message: 'Sample Evaluation created successfully',
      data: created,
    }
  }

  async findAll(limit = 100, offset = 0): Promise<SampleEvaluationResponseDto[]> {
    const evaluations = await this.sampleEvaluationRepository.find({
      take: limit,
      skip: offset,
      relations: [
        'client_supply',
        'sample_analysis',
        'source_client',
        'sample_evaluation_observs',
        'sample_evaluation_observs.observation',
      ],
    });

    return Promise.all(
      evaluations.map((e) => this.toResponseDto(e)),
    );
  }

  async findOne(id: number): Promise<SampleEvaluationResponseDto> {
    const evaluation = await this.sampleEvaluationRepository.findOne({
      where: { id },
      relations: [
        'client_supply',
        'sample_analysis',
        'source_client',
        'sample_evaluation_observs',
        'sample_evaluation_observs.observation',
      ],
    });

    if (!evaluation) throw new NotFoundException('Sample Evaluation not found');

    return this.toResponseDto(evaluation);
  }

  private async toResponseDto(entity: SampleEvaluationEntity): Promise<SampleEvaluationResponseDto> {
    return toDto(SampleEvaluationResponseDto, entity);
  }

  async update(id: number, dto: UpdateSampleEvaluationDto) {
    const evaluation = await this.sampleEvaluationRepository.findOne({
      where: { id },
      relations: ['client_supply', 'sample_analysis', 'source_client'],
    });

    if (!evaluation) {
      throw new NotFoundException('Sample Evaluation not found');
    }

    if (dto.client_supply_id) {
      const client_supply = await this.clientSupplyRepository.findOne({ where: { id: dto.client_supply_id } });
      if (!client_supply) throw new NotFoundException('Client Supply not found');
      evaluation.client_supply = client_supply;
    }

    if (dto.sample_analysis_id) {
      const sample_analysis = await this.sampleAnalysisRepository.findOne({ where: { id: dto.sample_analysis_id } });
      if (!sample_analysis) throw new NotFoundException('Sample Analysis not found');
      evaluation.sample_analysis = sample_analysis;
    }

    if (dto.self_performed !== undefined) {
      evaluation.self_performed = dto.self_performed;
    }

    if (dto.source_client) {
      const source_client = await this.clientRepository.findOne({ where: { id: dto.source_client } });
      if (!source_client) throw new NotFoundException('Client not found');
      evaluation.source_client = source_client;
    }

    if (dto.decision_continue !== undefined) {
      evaluation.decision_continue = dto.decision_continue;
    }

    await this.sampleEvaluationRepository.save(evaluation);

    return { message: 'Sample Evaluation updated successfully' };
  }

  async remove(id: number): Promise<{ message: string }> {
    const evaluation = await this.sampleEvaluationRepository.findOne({
      where: { id },
    });

    if (!evaluation) {
      throw new NotFoundException('Sample Evaluation not found');
    }

    await this.sampleEvaluationRepository.remove(evaluation);

    return { message: 'Sample Evaluation deleted successfully' };
  }
}
