import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SampleAnalysisObservationEntity } from './sample_analysis_observation.entity';
import { SampleAnalysisEntity } from '../sample_analysis/sample_analysis.entity';
import { ObservationService } from '../observation/observation.service';
import { CreateSampleAnalysisObservationDto, SampleAnalysisObservationResponseDto, UpdateSampleAnalysisObservationDto } from './dtos';
import { toDto } from 'src/common/utils/mapper.util';

@Injectable()
export class SampleAnalysisObservationService {
  constructor(
    @InjectRepository(SampleAnalysisObservationEntity)
    private readonly sampleAnalysisObservationRepository: Repository<SampleAnalysisObservationEntity>,

    @InjectRepository(SampleAnalysisEntity)
    private readonly sampleAnalysisRepository: Repository<SampleAnalysisEntity>,
    
    @Inject(forwardRef(() => ObservationService))
    private readonly observationService: ObservationService,
  ) {}

  async create(dto: CreateSampleAnalysisObservationDto): Promise<{ message: string; data: SampleAnalysisObservationEntity }> {
    const sample_analysis = await this.sampleAnalysisRepository.findOne({
      where: { id: dto.sample_analysis_id },
    });

    if (!sample_analysis) {
      throw new NotFoundException('Sample Analysis not found');
    }

    let observation;

    if (dto.observation_id) {
      observation = await this.observationService.findOneEntity(dto.observation_id);

    } else if (dto.observation) {
      observation = await this.observationService.createOrGet(dto.observation);

    } else {
      throw new BadRequestException('Observation data is required');
    }

    const link = this.sampleAnalysisObservationRepository.create({
      sample_analysis,
      observation,
    });

    const created = await this.sampleAnalysisObservationRepository.save(link);

    return {
      message: 'Sample Analysis Observation created successfully',
      data: created,
    };
  }

  async findAll(limit = 100, offset = 0): Promise<SampleAnalysisObservationResponseDto[]> {
    const items = await this.sampleAnalysisObservationRepository.find({
      take: limit,
      skip: offset,
      relations: ['sample_analysis', 'observation'],
    });

    return Promise.all(items.map((i) => this.toResponseDto(i)));
  }

  async findOne(id: number): Promise<SampleAnalysisObservationResponseDto> {
    const item = await this.sampleAnalysisObservationRepository.findOne({
      where: { id },
      relations: ['sample_analysis', 'observation'],
    });

    if (!item) throw new NotFoundException('Sample Analysis Observation not found');

    return this.toResponseDto(item);
  }

  private async toResponseDto(entity: SampleAnalysisObservationEntity) {
    return toDto(SampleAnalysisObservationResponseDto, entity);
  }

  async update(id: number, dto: UpdateSampleAnalysisObservationDto) {
    const link = await this.sampleAnalysisObservationRepository.findOne({
      where: { id },
      relations: ['sample_analysis', 'observation'],
    });

    if (!link) {
      throw new NotFoundException('Sample Analysis Observation not found');
    }

    if (dto.sample_analysis_id) {
      const analysis = await this.sampleAnalysisRepository.findOne({
        where: { id: dto.sample_analysis_id },
      });

      if (!analysis) throw new NotFoundException('Sample Analysis not found');

      link.sample_analysis = analysis;
    }

    if (dto.observation_id) {
      const obs = await this.observationService.findOneEntity(dto.observation_id);
      link.observation = obs;
    }

    if (dto.observation) {
      const updatedObs = await this.observationService.createOrGet(dto.observation);
      link.observation = updatedObs;
    }

    await this.sampleAnalysisObservationRepository.save(link);

    return { message: 'Sample Analysis Observation updated successfully' };
  }

  async remove(id: number) {
    const link = await this.sampleAnalysisObservationRepository.findOne({
      where: { id },
    });

    if (!link) {
      throw new NotFoundException('Sample Analysis Observation not found');
    }

    await this.sampleAnalysisObservationRepository.remove(link);

    return { message: 'Sample Analysis Observation deleted successfully' };
  }
}
