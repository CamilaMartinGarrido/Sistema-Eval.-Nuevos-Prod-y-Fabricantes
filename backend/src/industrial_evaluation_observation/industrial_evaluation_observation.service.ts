import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IndustrialEvaluationObservationEntity } from './industrial_evaluation_observation.entity';
import { IndustrialEvaluationEntity } from '../industrial_evaluation/industrial_evaluation.entity';
import { ObservationService } from '../observation/observation.service';
import { CreateIndustrialEvaluationObservationDto, IndustrialEvaluationObservationResponseDto, UpdateIndustrialEvaluationObservationDto } from './dtos';
import { toDto } from 'src/common/utils/mapper.util';

@Injectable()
export class IndustrialEvaluationObservationService {
  constructor(
    @InjectRepository(IndustrialEvaluationObservationEntity)
    private readonly industrialEvaluationObservationRepository: Repository<IndustrialEvaluationObservationEntity>,

    @InjectRepository(IndustrialEvaluationEntity)
    private readonly industrialEvaluationRepository: Repository<IndustrialEvaluationEntity>,
            
    @Inject(forwardRef(() => ObservationService))
    private readonly observationService: ObservationService,
  ) {}

  async create(dto: CreateIndustrialEvaluationObservationDto): Promise<{ message: string; data: IndustrialEvaluationObservationEntity }> {
    const industrial_evaluation = await this.industrialEvaluationRepository.findOne({
      where: { id: dto.industrial_evaluation_id },
    });

    if (!industrial_evaluation) {
      throw new NotFoundException('Industrial Evaluation not found');
    }

    let observation;

    if (dto.observation_id) {
      observation = await this.observationService.findOneEntity(dto.observation_id);

    } else if (dto.observation) {
      observation = await this.observationService.createOrGet(dto.observation);

    } else {
      throw new BadRequestException('Observation data is required');
    }

    const link = this.industrialEvaluationObservationRepository.create({
      industrial_evaluation,
      observation,
    });

    const created = await this.industrialEvaluationObservationRepository.save(link);

    return {
      message: 'Industrial Evaluation Observation created successfully',
      data: created,
    };
  }

  async findAll(limit = 100, offset = 0): Promise<IndustrialEvaluationObservationResponseDto[]> {
    const items = await this.industrialEvaluationObservationRepository.find({
      take: limit,
      skip: offset,
      relations: ['industrial_evaluation', 'observation'],
    });

    return Promise.all(items.map((i) => this.toResponseDto(i)));
  }

  async findOne(id: number): Promise<IndustrialEvaluationObservationResponseDto> {
    const item = await this.industrialEvaluationObservationRepository.findOne({
      where: { id },
      relations: ['industrial_evaluation', 'observation'],
    });

    if (!item) throw new NotFoundException('Industrial Evaluation Observation not found');

    return this.toResponseDto(item);
  }

  private async toResponseDto(entity: IndustrialEvaluationObservationEntity) {
    return toDto(IndustrialEvaluationObservationResponseDto, entity);
  }

  async update(id: number, dto: UpdateIndustrialEvaluationObservationDto) {
    const link = await this.industrialEvaluationObservationRepository.findOne({
      where: { id },
      relations: ['industrial_evaluation', 'observation'],
    });

    if (!link) {
      throw new NotFoundException('Industrial Evaluation Observation not found');
    }

    if (dto.industrial_evaluation_id) {
      const evaluation = await this.industrialEvaluationRepository.findOne({
        where: { id: dto.industrial_evaluation_id },
      });

      if (!evaluation) throw new NotFoundException('Industrial Evaluation not found');

      link.industrial_evaluation = evaluation;
    }

    if (dto.observation_id) {
      const obs = await this.observationService.findOneEntity(dto.observation_id);
      link.observation = obs;
    }

    if (dto.observation) {
      const updatedObs = await this.observationService.createOrGet(dto.observation);
      link.observation = updatedObs;
    }

    await this.industrialEvaluationObservationRepository.save(link);

    return { message: 'Industrial Evaluation Observation updated successfully' };
  }

  async remove(id: number) {
    const link = await this.industrialEvaluationObservationRepository.findOne({
      where: { id },
    });

    if (!link) {
      throw new NotFoundException('Industrial Evaluation Observation not found');
    }

    await this.industrialEvaluationObservationRepository.remove(link);

    return { message: 'Industrial Evaluation Observation deleted successfully' };
  }
}
