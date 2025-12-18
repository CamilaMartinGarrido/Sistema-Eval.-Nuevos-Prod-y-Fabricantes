import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExploratoryOfferObservationEntity } from './exploratory_offer_observation.entity';
import { CreateExploratoryOfferObservationDto, UpdateExploratoryOfferObservationDto, ExploratoryOfferObservationResponseDto } from './dtos';
import { ExploratoryOfferEntity } from 'src/exploratory_offer/exploratory_offer.entity';
import { toDto } from 'src/common/utils/mapper.util';
import { ObservationService } from 'src/observation/observation.service';

@Injectable()
export class ExploratoryOfferObservationService {
  constructor(
    @InjectRepository(ExploratoryOfferObservationEntity)
    private readonly exploratoryOfferObservationRepository: Repository<ExploratoryOfferObservationEntity>,

    @InjectRepository(ExploratoryOfferEntity)
    private readonly expOfferRepository: Repository<ExploratoryOfferEntity>,

    @Inject(forwardRef(() => ObservationService))
    private readonly observationService: ObservationService,
  ) {}

  async create(dto: CreateExploratoryOfferObservationDto): Promise<{ message: string; data: ExploratoryOfferObservationEntity }> {
    // 1. Obtener la Exploratory Offer
    const exploratory_offer = await this.expOfferRepository.findOne({
      where: { id: dto.exploratory_offer_id },
    });

    if (!exploratory_offer) {
      throw new NotFoundException('Exploratory Offer not found');
    }

    // 2. Obtener o crear Observation
    let observation;

    if (dto.observation_id) {
      // Caso A: Se pasa observation_id
      observation = await this.observationService.findOneEntity(dto.observation_id);

    } else if (dto.observation) {
      // Caso B: Se pasa una nueva observation → createOrGet()
      observation = await this.observationService.createOrGet(dto.observation);

    } else {
      throw new BadRequestException('Observation data is required');
    }

    // 3. Crear relación
    const link = this.exploratoryOfferObservationRepository.create({
      exploratory_offer,
      observation,
    });

    const created = await this.exploratoryOfferObservationRepository.save(link);

    return {
      message: 'Exploratory Offer Observation created successfully',
      data: created,
    };
  }

  async findAll(limit = 100, offset = 0): Promise<ExploratoryOfferObservationResponseDto[]> {
    const items = await this.exploratoryOfferObservationRepository.find({
      take: limit,
      skip: offset,
      relations: ['exploratory_offer', 'observation'],
    });

    return Promise.all(items.map((i) => this.toResponseDto(i)));
  }

  async findOne(id: number): Promise<ExploratoryOfferObservationResponseDto> {
    const item = await this.exploratoryOfferObservationRepository.findOne({
      where: { id },
      relations: ['exploratory_offer', 'observation'],
    });

    if (!item) throw new NotFoundException('Exploratory Offer Observation not found');

    return this.toResponseDto(item);
  }

  private async toResponseDto(entity: ExploratoryOfferObservationEntity) {
    return toDto(ExploratoryOfferObservationResponseDto, entity);
  }

  async update(id: number, dto: UpdateExploratoryOfferObservationDto) {
    const link = await this.exploratoryOfferObservationRepository.findOne({
      where: { id },
      relations: ['exploratory_offer', 'observation'],
    });

    if (!link) {
      throw new NotFoundException('Exploratory Offer Observation not found');
    }

    // Cambiar exploratory_offer
    if (dto.exploratory_offer_id) {
      const offer = await this.expOfferRepository.findOne({
        where: { id: dto.exploratory_offer_id },
      });

      if (!offer) throw new NotFoundException('Exploratory Offer not found');

      link.exploratory_offer = offer;
    }

    // Cambiar Observation por ID
    if (dto.observation_id) {
      const obs = await this.observationService.findOneEntity(dto.observation_id);
      link.observation = obs;
    }

    // Cambiar Observation por datos (actualizar o crear)
    if (dto.observation) {
      const updatedObs = await this.observationService.createOrGet(dto.observation);
      link.observation = updatedObs;
    }

    await this.exploratoryOfferObservationRepository.save(link);

    return { message: 'Exploratory Offer Observation updated successfully' };
  }

  async remove(id: number) {
    const link = await this.exploratoryOfferObservationRepository.findOne({
      where: { id },
    });

    if (!link) {
      throw new NotFoundException('Exploratory Offer Observation not found');
    }

    await this.exploratoryOfferObservationRepository.remove(link);

    return { message: 'Exploratory Offer Observation deleted successfully' };
  }
}
