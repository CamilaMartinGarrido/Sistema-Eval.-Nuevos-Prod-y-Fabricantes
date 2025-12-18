import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObservationEntity } from './observation.entity';
import { CreateObservationDto, ObservationResponseDto, UpdateObservationDto } from './dtos';
import { toDto } from 'src/common/utils/mapper.util';

@Injectable()
export class ObservationService {
  constructor(
    @InjectRepository(ObservationEntity)
    private readonly observationRepository: Repository<ObservationEntity>,
  ) {}

  async create(dto: CreateObservationDto): Promise<{ message: string; data: ObservationEntity }> {
    const observation = this.observationRepository.create(dto);
    const created = await this.observationRepository.save(observation);
    
    return { 
      message: 'Observation created successfully',
      data: created,
    };
  }

  async findAll(limit = 100, offset = 0) {
    const observations = await this.observationRepository.find({
      take: limit,
      skip: offset,
    });

    return Promise.all(
      observations.map(async (o) => this.toResponseDto(o)),
    );
  }

  async findOne(id: number) {
    const observation = await this.observationRepository.findOne({ where: { id } });
    if (!observation) {
      throw new NotFoundException('Observation not found');
    }
    return this.toResponseDto(observation);
  }

  private async toResponseDto(entity: ObservationEntity): Promise<ObservationResponseDto> {
    return toDto(ObservationResponseDto, entity);
  }

  async update(id: number, dto: UpdateObservationDto) {
    const result = await this.observationRepository.update(id, dto);
    if (result.affected === 0) {
      throw new NotFoundException('Observation could not be updated');
    }
    return { message: 'Observation updated successfully' };
  }

  async remove(id: number) {
    const observation = await this.findOneEntity(id);

    const usageCount = await this.observationRepository
      .createQueryBuilder('observation')
      .leftJoin('observation.exploratory_offer_observations', 'eoo')
      .where('observation.id = :id', { id })
      .getCount();

    if (usageCount > 0) {
      throw new BadRequestException(
        'Cannot delete Observation: it is linked to one or more Exploratory Offer Observations',
      );
    }

    await this.observationRepository.remove(observation);
    return { message: 'Observation deleted successfully' };
  }

  async findOneEntity(id: number): Promise<ObservationEntity> {
    const observation = await this.observationRepository.findOne({ where: { id } });
    if (!observation) throw new NotFoundException('Observation not found');
    return observation;
  }

  async findByTextAndDate(text: string, date: string) {
    return this.observationRepository.findOne({
      where: { observation_text: text, observation_date: date },
    });
  }

  async createOrGet(dto: CreateObservationDto): Promise<ObservationEntity> {
    const existing = await this.findByTextAndDate(dto.observation_text, dto.observation_date);
    if (existing) return existing;

    const observation = this.observationRepository.create(dto);
    return await this.observationRepository.save(observation);
  }
}
