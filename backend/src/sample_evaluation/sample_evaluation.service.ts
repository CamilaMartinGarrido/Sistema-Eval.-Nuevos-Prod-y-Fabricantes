import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SampleEvaluationEntity } from './sample_evaluation.entity';
import { CreateSampleEvaluationDto } from './dto';

@Injectable()
export class SampleEvaluationService {
  constructor(
    @InjectRepository(SampleEvaluationEntity)
    private readonly sampleEvaluationRepository: Repository<SampleEvaluationEntity>,
  ) {}

  create(dto: CreateSampleEvaluationDto) {
    const e = this.sampleEvaluationRepository.create(dto);
    return this.sampleEvaluationRepository.save(e);
  }

  findAll(limit = 100, offset = 0) {
    return this.sampleEvaluationRepository.find({ take: limit, skip: offset });
  }

  findOne(id: number) {
    return this.sampleEvaluationRepository.findOneBy({ id });
  }

  async update(id: number, dto: Partial<CreateSampleEvaluationDto>) {
    await this.sampleEvaluationRepository.update(id, dto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.sampleEvaluationRepository.delete(id);
  }
}
