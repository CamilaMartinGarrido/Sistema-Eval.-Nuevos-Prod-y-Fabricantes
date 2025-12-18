import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SampleAnalysisObservationEntity } from './sample_analysis_observation.entity';
import { CreateSampleAnalysisObservationDto } from './dto';

@Injectable()
export class SampleAnalysisObservationService {
  constructor(
    @InjectRepository(SampleAnalysisObservationEntity)
    private readonly sampleAnalysisObservationRepository: Repository<SampleAnalysisObservationEntity>,
  ) {}

  create(dto: CreateSampleAnalysisObservationDto) {
    const e = this.sampleAnalysisObservationRepository.create(dto);
    return this.sampleAnalysisObservationRepository.save(e);
  }

  findAll(limit = 100, offset = 0) {
    return this.sampleAnalysisObservationRepository.find({
      take: limit,
      skip: offset,
    });
  }

  findOne(id: number) {
    return this.sampleAnalysisObservationRepository.findOneBy({ id });
  }

  async update(id: number, dto: Partial<CreateSampleAnalysisObservationDto>) {
    await this.sampleAnalysisObservationRepository.update(id, dto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.sampleAnalysisObservationRepository.delete(id);
  }
}
