import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestOfferEntity } from './request_offer.entity';
import { CreateRequestOfferDto } from './dto';

@Injectable()
export class RequestOfferService {
  constructor(
    @InjectRepository(RequestOfferEntity)
    private readonly requestOfferRepository: Repository<RequestOfferEntity>,
  ) {}

  create(dto: CreateRequestOfferDto) {
    const e = this.requestOfferRepository.create(dto);
    return this.requestOfferRepository.save(e);
  }

  findAll(limit = 100, offset = 0) {
    return this.requestOfferRepository.find({ take: limit, skip: offset });
  }

  findOne(id: number) {
    return this.requestOfferRepository.findOneBy({ id });
  }

  async update(id: number, dto: Partial<CreateRequestOfferDto>) {
    await this.requestOfferRepository.update(id, dto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.requestOfferRepository.delete(id);
  }
}
