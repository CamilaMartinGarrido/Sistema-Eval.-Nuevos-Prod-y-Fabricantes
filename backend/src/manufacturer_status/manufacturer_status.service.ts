import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ManufacturerStatusEntity } from './manufacturer_status.entity';
import { CreateManufacturerStatusDto } from './dto';

@Injectable()
export class ManufacturerStatusService {
  constructor(
    @InjectRepository(ManufacturerStatusEntity)
    private readonly manufacturerStatusRepository: Repository<ManufacturerStatusEntity>,
  ) {}

  create(dto: CreateManufacturerStatusDto) {
    const e = this.manufacturerStatusRepository.create(dto);
    return this.manufacturerStatusRepository.save(e);
  }

  findAll(limit = 100, offset = 0) {
    return this.manufacturerStatusRepository.find({
      take: limit,
      skip: offset,
    });
  }

  findOne(id: number) {
    return this.manufacturerStatusRepository.findOneBy({ id });
  }

  async update(id: number, dto: Partial<CreateManufacturerStatusDto>) {
    await this.manufacturerStatusRepository.update(id, dto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.manufacturerStatusRepository.delete(id);
  }
}
