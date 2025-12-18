import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestObservationEntity } from './request_observation.entity';
import { CreateRequestObservationDto } from './dto';

@Injectable()
export class RequestObservationService {
  constructor(
    @InjectRepository(RequestObservationEntity)
    private readonly requestObservationRepository: Repository<RequestObservationEntity>,
  ) {}

  create(dto: CreateRequestObservationDto) {
    const e = this.requestObservationRepository.create(dto);
    return this.requestObservationRepository.save(e);
  }

  findAll(limit = 100, offset = 0) {
    return this.requestObservationRepository.find({
      take: limit,
      skip: offset,
    });
  }

  findOne(id: number) {
    return this.requestObservationRepository.findOneBy({ id });
  }

  async update(id: number, dto: Partial<CreateRequestObservationDto>) {
    await this.requestObservationRepository.update(id, dto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.requestObservationRepository.delete(id);
  }
}
