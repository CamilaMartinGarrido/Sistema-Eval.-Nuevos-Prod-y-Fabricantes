import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IndustrialPurchaseEntity } from './industrial_purchase.entity';
import { CreateIndustrialPurchaseDto } from './dto';

@Injectable()
export class IndustrialPurchaseService {
  constructor(
    @InjectRepository(IndustrialPurchaseEntity)
    private readonly industrialPurchaseRepository: Repository<IndustrialPurchaseEntity>,
  ) {}

  create(dto: CreateIndustrialPurchaseDto) {
    const e = this.industrialPurchaseRepository.create(dto);
    return this.industrialPurchaseRepository.save(e);
  }

  findAll(limit = 100, offset = 0) {
    return this.industrialPurchaseRepository.find({
      take: limit,
      skip: offset,
    });
  }

  findOne(id: number) {
    return this.industrialPurchaseRepository.findOneBy({ id });
  }

  async update(id: number, dto: Partial<CreateIndustrialPurchaseDto>) {
    await this.industrialPurchaseRepository.update(id, dto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.industrialPurchaseRepository.delete(id);
  }
}
