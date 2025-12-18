import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommercialEntityEntity } from './commercial_entity.entity';
import { CreateCommercialEntityDto, UpdateCommercialEntityDto } from './dtos';
import { toDto } from 'src/common/utils/mapper.util';
import { CommercialEntityResponseDto } from './dtos/commercial_entity-response-dto';

@Injectable()
export class CommercialEntityService {
  constructor(
    @InjectRepository(CommercialEntityEntity)
    private readonly ceRepository: Repository<CommercialEntityEntity>,
  ) {}

  async create(dto: CreateCommercialEntityDto): Promise<{ message: string; data: CommercialEntityEntity }> {
    const commercial = this.ceRepository.create(dto);
    const created = await this.ceRepository.save(commercial);
    
    return { 
      message: 'Commercial Entity created successfully',
      data: created,
    };
  }

  async findAll(limit = 100, offset = 0) {
    const entities = await this.ceRepository.find({
      take: limit,
      skip: offset,
    });

    return Promise.all(
      entities.map(async (entity) => this.toResponseDto(entity)),
    );
  }

  async findOne(id: number) {
    const commercial = await this.ceRepository.findOne({ where: { id } });
    if (!commercial) {
      throw new NotFoundException('Commercial Entity not found');
    }
    return this.toResponseDto(commercial);
  }

  private async toResponseDto(entity: CommercialEntityEntity): Promise<CommercialEntityResponseDto> {
    return toDto(CommercialEntityResponseDto, entity);
  }

  async update(id: number, dto: UpdateCommercialEntityDto) {
    const result = await this.ceRepository.update(id, dto);
    if (result.affected === 0) {
      throw new NotFoundException('Commercial Entity could not be updated');
    }
    return { message: 'Commercial Entity updated successfully' };
  }

  async remove(id: number) {
    const commercial = await this.findOneEntity(id);

    const makerCount = await this.ceRepository
      .createQueryBuilder('ce')
      .leftJoin('ce.makers', 'maker')
      .where('ce.id = :id', { id })
      .getCount();

    const supplierCount = await this.ceRepository
      .createQueryBuilder('ce')
      .leftJoin('ce.suppliers', 'supplier')
      .where('ce.id = :id', { id })
      .getCount();

    if (makerCount > 0 || supplierCount > 0) {
      throw new BadRequestException(
        'Cannot delete Commercial Entity: it has associated Makers or Suppliers',
      );
    }

    await this.ceRepository.remove(commercial);

    return { message: 'Commercial Entity deleted successfully' };
  }

  async findOneEntity(id: number): Promise<CommercialEntityEntity> {
    const entity = await this.ceRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException('Commercial Entity not found');
    }

    return entity;
  }

  async findByNameAndCountry(name: string, country: string) {
    return this.ceRepository.findOne({
      where: { entity_name: name, entity_country: country },
    });
  }
}
