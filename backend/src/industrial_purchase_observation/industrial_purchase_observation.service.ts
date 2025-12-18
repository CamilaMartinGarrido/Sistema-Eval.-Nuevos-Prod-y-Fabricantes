import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IndustrialPurchaseObservationEntity } from './industrial_purchase_observation.entity';
import { CreateIndustrialPurchaseObservationDto } from './dto';

@Injectable()
export class IndustrialPurchaseObservationService {
  constructor(
    @InjectRepository(IndustrialPurchaseObservationEntity)
    private readonly industrialPurchaseObservationRepository: Repository<IndustrialPurchaseObservationEntity>,
  ) {}

  create(dto: CreateIndustrialPurchaseObservationDto) {
    const e = this.industrialPurchaseObservationRepository.create(dto);
    return this.industrialPurchaseObservationRepository.save(e);
  }

  findAll(limit = 100, offset = 0) {
    return this.industrialPurchaseObservationRepository.find({
      take: limit,
      skip: offset,
    });
  }

  findOne(id: number) {
    return this.industrialPurchaseObservationRepository.findOneBy({ id });
  }

  async update(
    id: number,
    dto: Partial<CreateIndustrialPurchaseObservationDto>,
  ) {
    await this.industrialPurchaseObservationRepository.update(id, dto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.industrialPurchaseObservationRepository.delete(id);
  }
}
