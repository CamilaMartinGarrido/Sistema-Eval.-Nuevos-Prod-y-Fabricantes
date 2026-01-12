import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SampleEvaluationEntity } from './sample_evaluation.entity';
import { EvaluationProcessEntity } from '../evaluation_process/evaluation_process.entity';
import { SampleAnalysisEntity } from '../sample_analysis/sample_analysis.entity';
import { CreateSampleEvaluationDto, SampleEvaluationResponseDto, UpdateSampleEvaluationDto } from './dtos';
import { toDto } from 'src/common/utils/mapper.util';

@Injectable()
export class SampleEvaluationService {
  constructor(
    @InjectRepository(SampleEvaluationEntity)
    private readonly sampleEvaluationRepository: Repository<SampleEvaluationEntity>,

    @InjectRepository(EvaluationProcessEntity)
    private readonly evaluationProcessRepository: Repository<EvaluationProcessEntity>,

    @InjectRepository(SampleAnalysisEntity)
    private readonly sampleAnalysisRepository: Repository<SampleAnalysisEntity>,
  ) {}

  async create(dto: CreateSampleEvaluationDto): Promise<{ message: string; data: SampleEvaluationEntity }> {
    const evaluation_process = await this.evaluationProcessRepository.findOne({ where: { id: dto.evaluation_process_id } });
    if (!evaluation_process) throw new NotFoundException('Evaluation Process not found');

    const sample_analysis = await this.sampleAnalysisRepository.findOne({ where: { id: dto.sample_analysis_id } });
    if (!sample_analysis) throw new NotFoundException('Sample Analysis not found');

    const evaluation = this.sampleEvaluationRepository.create({
      evaluation_process,
      sample_analysis,
      self_performed: dto.self_performed,
      send_analysis_date: dto.send_analysis_date,
      evaluation_date: dto.evaluation_date,
      result: dto.result,
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
        'evaluation_process',
        'sample_analysis',
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
        'evaluation_process',
        'sample_analysis',
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
      relations: ['evaluation_process', 'sample_analysis', 'source_client'],
    });

    if (!evaluation) {
      throw new NotFoundException('Sample Evaluation not found');
    }

    if (dto.evaluation_process_id) {
      const evaluation_process = await this.evaluationProcessRepository.findOne({ where: { id: dto.evaluation_process_id } });
      if (!evaluation_process) throw new NotFoundException('Evaluation Process not found');
      evaluation.evaluation_process = evaluation_process;
    }

    if (dto.sample_analysis_id) {
      const sample_analysis = await this.sampleAnalysisRepository.findOne({ where: { id: dto.sample_analysis_id } });
      if (!sample_analysis) throw new NotFoundException('Sample Analysis not found');
      evaluation.sample_analysis = sample_analysis;
    }

    if (dto.self_performed !== undefined) {
      evaluation.self_performed = dto.self_performed;
    }

    if (dto.send_analysis_date !== undefined) {
      evaluation.send_analysis_date = dto.send_analysis_date;
    }

    if (dto.evaluation_date !== undefined) {
      evaluation.evaluation_date = dto.evaluation_date;
    }

    if (dto.result !== undefined) {
      evaluation.result = dto.result;
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
