import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IndustrialPurchaseObservationEntity } from './industrial_purchase_observation.entity';
import { IndustrialPurchaseEntity } from '../industrial_purchase/industrial_purchase.entity';
import { ObservationService } from '../observation/observation.service';
import { CreateIndustrialPurchaseObservationDto, IndustrialPurchaseObservationResponseDto, UpdateIndustrialPurchaseObservationDto } from './dtos';
import { toDto } from 'src/common/utils/mapper.util';

@Injectable()
export class IndustrialPurchaseObservationService {
  constructor(
    @InjectRepository(IndustrialPurchaseObservationEntity)
    private readonly industrialPurchaseObservationRepository: Repository<IndustrialPurchaseObservationEntity>,

    @InjectRepository(IndustrialPurchaseEntity)
    private readonly industrialPurchaseRepository: Repository<IndustrialPurchaseEntity>,
        
    @Inject(forwardRef(() => ObservationService))
    private readonly observationService: ObservationService,
  ) {}

  async create(dto: CreateIndustrialPurchaseObservationDto): Promise<{ message: string; data: IndustrialPurchaseObservationEntity }> {
    const industrial_purchase = await this.industrialPurchaseRepository.findOne({
      where: { id: dto.industrial_purchase_id },
    });

    if (!industrial_purchase) {
      throw new NotFoundException('Industrial Purchase not found');
    }

    let observation;

    if (dto.observation_id) {
      observation = await this.observationService.findOneEntity(dto.observation_id);

    } else if (dto.observation) {
      observation = await this.observationService.createOrGet(dto.observation);

    } else {
      throw new BadRequestException('Observation data is required');
    }

    const link = this.industrialPurchaseObservationRepository.create({
      industrial_purchase,
      observation,
    });

    const created = await this.industrialPurchaseObservationRepository.save(link);

    return {
      message: 'Industrial Purchase Observation created successfully',
      data: created,
    };
  }

  async findAll(limit = 100, offset = 0): Promise<IndustrialPurchaseObservationResponseDto[]> {
    const items = await this.industrialPurchaseObservationRepository.find({
      take: limit,
      skip: offset,
      relations: ['industrial_purchase', 'observation'],
    });

    return Promise.all(items.map((i) => this.toResponseDto(i)));
  }

  async findOne(id: number): Promise<IndustrialPurchaseObservationResponseDto> {
    const item = await this.industrialPurchaseObservationRepository.findOne({
      where: { id },
      relations: ['industrial_purchase', 'observation'],
    });

    if (!item) throw new NotFoundException('Industrial Purchase Observation not found');

    return this.toResponseDto(item);
  }

  private async toResponseDto(entity: IndustrialPurchaseObservationEntity) {
    return toDto(IndustrialPurchaseObservationResponseDto, entity);
  }

  async update(id: number, dto: UpdateIndustrialPurchaseObservationDto) {
    const link = await this.industrialPurchaseObservationRepository.findOne({
      where: { id },
      relations: ['industrial_purchase', 'observation'],
    });

    if (!link) {
      throw new NotFoundException('Industrial Purchase Observation not found');
    }

    if (dto.industrial_purchase_id) {
      const purchase = await this.industrialPurchaseRepository.findOne({
        where: { id: dto.industrial_purchase_id },
      });

      if (!purchase) throw new NotFoundException('Industrial Purchase not found');

      link.industrial_purchase = purchase;
    }

    if (dto.observation_id) {
      const obs = await this.observationService.findOneEntity(dto.observation_id);
      link.observation = obs;
    }

    if (dto.observation) {
      const updatedObs = await this.observationService.createOrGet(dto.observation);
      link.observation = updatedObs;
    }

    await this.industrialPurchaseObservationRepository.save(link);

    return { message: 'Industrial Purchase Observation updated successfully' };
  }

  async remove(id: number) {
    const link = await this.industrialPurchaseObservationRepository.findOne({
      where: { id },
    });

    if (!link) {
      throw new NotFoundException('Industrial Purchase Observation not found');
    }

    await this.industrialPurchaseObservationRepository.remove(link);

    return { message: 'Industrial Purchase Observation deleted successfully' };
  }
}
