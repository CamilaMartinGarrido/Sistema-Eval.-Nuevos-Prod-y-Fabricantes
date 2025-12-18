import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IndustrialEvaluationObservationEntity } from './industrial_evaluation_observation.entity';
import { CreateIndustrialEvaluationObservationDto } from './dto';

@Injectable()
export class IndustrialEvaluationObservationService {
  constructor(
    @InjectRepository(IndustrialEvaluationObservationEntity)
    private readonly industrialEvaluationObservationRepository: Repository<IndustrialEvaluationObservationEntity>,
  ) {}

  create(dto: CreateIndustrialEvaluationObservationDto) {
    const e = this.industrialEvaluationObservationRepository.create(dto);
    return this.industrialEvaluationObservationRepository.save(e);
  }

  findAll(limit = 100, offset = 0) {
    return this.industrialEvaluationObservationRepository.find({
      take: limit,
      skip: offset,
    });
  }

  findOne(id: number) {
    return this.industrialEvaluationObservationRepository.findOneBy({ id });
  }

  async update(
    id: number,
    dto: Partial<CreateIndustrialEvaluationObservationDto>,
  ) {
    await this.industrialEvaluationObservationRepository.update(id, dto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.industrialEvaluationObservationRepository.delete(id);
  }
}
