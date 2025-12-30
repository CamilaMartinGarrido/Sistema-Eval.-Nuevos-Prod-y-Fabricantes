import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SampleEvaluationObservationEntity } from './sample_evaluation_observation.entity';
import { SampleEvaluationEntity } from '../sample_evaluation/sample_evaluation.entity';
import { ObservationService } from '../observation/observation.service';
import { CreateSampleEvaluationObservationDto, SampleEvaluationObservationResponseDto, UpdateSampleEvaluationObservationDto } from './dtos';
import { toDto } from 'src/common/utils/mapper.util';

@Injectable()
export class SampleEvaluationObservationService {
  constructor(
    @InjectRepository(SampleEvaluationObservationEntity)
    private readonly sampleEvaluationObservationRepository: Repository<SampleEvaluationObservationEntity>,

    @InjectRepository(SampleEvaluationEntity)
    private readonly sampleEvaluationRepository: Repository<SampleEvaluationEntity>,
        
    @Inject(forwardRef(() => ObservationService))
    private readonly observationService: ObservationService,
  ) {}

  async create(dto: CreateSampleEvaluationObservationDto): Promise<{ message: string; data: SampleEvaluationObservationEntity }> {
    const sample_evaluation = await this.sampleEvaluationRepository.findOne({
      where: { id: dto.sample_evaluation_id },
    });

    if (!sample_evaluation) {
      throw new NotFoundException('Sample Evaluation not found');
    }

    let observation;

    if (dto.observation_id) {
      observation = await this.observationService.findOneEntity(dto.observation_id);

    } else if (dto.observation) {
      observation = await this.observationService.createOrGet(dto.observation);

    } else {
      throw new BadRequestException('Observation data is required');
    }

    const link = this.sampleEvaluationObservationRepository.create({
      sample_evaluation,
      observation,
    });

    const created = await this.sampleEvaluationObservationRepository.save(link);

    return {
      message: 'Sample Evaluation Observation created successfully',
      data: created,
    };
  }

  async findAll(limit = 100, offset = 0): Promise<SampleEvaluationObservationResponseDto[]> {
    const items = await this.sampleEvaluationObservationRepository.find({
      take: limit,
      skip: offset,
      relations: ['sample_evaluation', 'observation'],
    });

    return Promise.all(items.map((i) => this.toResponseDto(i)));
  }

  async findOne(id: number): Promise<SampleEvaluationObservationResponseDto> {
    const item = await this.sampleEvaluationObservationRepository.findOne({
      where: { id },
      relations: ['sample_evaluation', 'observation'],
    });

    if (!item) throw new NotFoundException('Sample Evaluation Observation not found');

    return this.toResponseDto(item);
  }

  private async toResponseDto(entity: SampleEvaluationObservationEntity) {
    return toDto(SampleEvaluationObservationResponseDto, entity);
  }

  async update(id: number, dto: UpdateSampleEvaluationObservationDto) {
    const link = await this.sampleEvaluationObservationRepository.findOne({
      where: { id },
      relations: ['sample_evaluation', 'observation'],
    });

    if (!link) {
      throw new NotFoundException('Sample Evaluation Observation not found');
    }

    if (dto.sample_evaluation_id) {
      const evaluation = await this.sampleEvaluationRepository.findOne({
        where: { id: dto.sample_evaluation_id },
      });

      if (!evaluation) throw new NotFoundException('Sample Evaluation not found');

      link.sample_evaluation = evaluation;
    }

    if (dto.observation_id) {
      const obs = await this.observationService.findOneEntity(dto.observation_id);
      link.observation = obs;
    }

    if (dto.observation) {
      const updatedObs = await this.observationService.createOrGet(dto.observation);
      link.observation = updatedObs;
    }

    await this.sampleEvaluationObservationRepository.save(link);

    return { message: 'Sample Evaluation Observation updated successfully' };
  }

  async remove(id: number) {
    const link = await this.sampleEvaluationObservationRepository.findOne({
      where: { id },
    });

    if (!link) {
      throw new NotFoundException('Sample Evaluation Observation not found');
    }

    await this.sampleEvaluationObservationRepository.remove(link);

    return { message: 'Sample Evaluation Observation deleted successfully' };
  }
}
