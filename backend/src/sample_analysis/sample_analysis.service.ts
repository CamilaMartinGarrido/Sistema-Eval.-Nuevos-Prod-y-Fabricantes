import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SampleAnalysisEntity } from './sample_analysis.entity';
import { CreateSampleAnalysisDto } from './dto';

@Injectable()
export class SampleAnalysisService {
  constructor(
    @InjectRepository(SampleAnalysisEntity)
    private readonly sampleAnalysisRepository: Repository<SampleAnalysisEntity>,
  ) {}

  create(dto: CreateSampleAnalysisDto) {
    const e = this.sampleAnalysisRepository.create(dto);
    return this.sampleAnalysisRepository.save(e);
  }

  findAll(limit = 100, offset = 0) {
    return this.sampleAnalysisRepository.find({ take: limit, skip: offset });
  }

  findOne(id: number) {
    return this.sampleAnalysisRepository.findOneBy({ id });
  }

  async update(id: number, dto: Partial<CreateSampleAnalysisDto>) {
    await this.sampleAnalysisRepository.update(id, dto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.sampleAnalysisRepository.delete(id);
  }
}
