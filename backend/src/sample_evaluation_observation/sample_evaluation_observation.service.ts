import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SampleEvaluationObservationEntity } from './sample_evaluation_observation.entity';
import { CreateSampleEvaluationObservationDto } from './dto';

@Injectable()
export class SampleEvaluationObservationService {
  constructor(
    @InjectRepository(SampleEvaluationObservationEntity)
    private readonly sampleEvaluationObservationRepository: Repository<SampleEvaluationObservationEntity>,
  ) {}

  create(dto: CreateSampleEvaluationObservationDto) {
    const e = this.sampleEvaluationObservationRepository.create(dto);
    return this.sampleEvaluationObservationRepository.save(e);
  }

  findAll(limit = 100, offset = 0) {
    return this.sampleEvaluationObservationRepository.find({
      take: limit,
      skip: offset,
    });
  }

  findOne(id: number) {
    return this.sampleEvaluationObservationRepository.findOneBy({ id });
  }

  async update(id: number, dto: Partial<CreateSampleEvaluationObservationDto>) {
    await this.sampleEvaluationObservationRepository.update(id, dto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.sampleEvaluationObservationRepository.delete(id);
  }
}
