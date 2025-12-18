import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SampleEntity } from './sample.entity';
import { CreateSampleDto } from './dto';

@Injectable()
export class SampleService {
  constructor(
    @InjectRepository(SampleEntity)
    private readonly sampleRepository: Repository<SampleEntity>,
  ) {}

  create(dto: CreateSampleDto) {
    const e = this.sampleRepository.create(dto);
    return this.sampleRepository.save(e);
  }

  findAll(limit = 100, offset = 0) {
    return this.sampleRepository.find({ take: limit, skip: offset });
  }

  findOne(id: number) {
    return this.sampleRepository.findOneBy({ id });
  }

  async update(id: number, dto: Partial<CreateSampleDto>) {
    await this.sampleRepository.update(id, dto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.sampleRepository.delete(id);
  }
}
