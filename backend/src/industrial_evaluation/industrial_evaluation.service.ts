import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IndustrialEvaluationEntity } from './industrial_evaluation.entity';
import { CreateIndustrialEvaluationDto } from './dto';

@Injectable()
export class IndustrialEvaluationService {
  constructor(
    @InjectRepository(IndustrialEvaluationEntity)
    private readonly industrialEvaluationRepository: Repository<IndustrialEvaluationEntity>,
  ) {}

  create(dto: CreateIndustrialEvaluationDto) {
    const e = this.industrialEvaluationRepository.create(dto);
    return this.industrialEvaluationRepository.save(e);
  }

  findAll(limit = 100, offset = 0) {
    return this.industrialEvaluationRepository.find({
      take: limit,
      skip: offset,
    });
  }

  findOne(id: number) {
    return this.industrialEvaluationRepository.findOneBy({ id });
  }

  async update(id: number, dto: Partial<CreateIndustrialEvaluationDto>) {
    await this.industrialEvaluationRepository.update(id, dto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.industrialEvaluationRepository.delete(id);
  }
}
