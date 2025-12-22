import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestObservationEntity } from './request_observation.entity';
import { ApplicationEntity } from '../application/application.entity';
import { ObservationService } from '../observation/observation.service';
import { CreateRequestObservationDto, RequestObservationResponseDto, UpdateRequestObservationDto } from './dtos';
import { toDto } from 'src/common/utils/mapper.util';

@Injectable()
export class RequestObservationService {
  constructor(
    @InjectRepository(RequestObservationEntity)
    private readonly requestObservationRepository: Repository<RequestObservationEntity>,

    @InjectRepository(ApplicationEntity)
    private readonly appRepository: Repository<ApplicationEntity>,
    
    @Inject(forwardRef(() => ObservationService))
    private readonly observationService: ObservationService,
  ) {}

  async create(dto: CreateRequestObservationDto): Promise<{ message: string; data: RequestObservationEntity }> {
    // 1. Obtener la Request/Application
    const application = await this.appRepository.findOne({
      where: { id: dto.application_id },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
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
    const link = this.requestObservationRepository.create({
      application,
      observation,
    });

    const created = await this.requestObservationRepository.save(link);

    return {
      message: 'Request Observation created successfully',
      data: created,
    };
  }

  async findAll(limit = 100, offset = 0): Promise<RequestObservationResponseDto[]> {
    const items = await this.requestObservationRepository.find({
      take: limit,
      skip: offset,
      relations: ['application', 'observation'],
    });

    return Promise.all(items.map((i) => this.toResponseDto(i)));
  }

  async findOne(id: number): Promise<RequestObservationResponseDto> {
    const item = await this.requestObservationRepository.findOne({
      where: { id },
      relations: ['application', 'observation'],
    });

    if (!item) throw new NotFoundException('Request Observation not found');

    return this.toResponseDto(item);
  }

  private async toResponseDto(entity: RequestObservationEntity) {
    return toDto(RequestObservationResponseDto, entity);
  }

  async update(id: number, dto: UpdateRequestObservationDto) {
    const link = await this.requestObservationRepository.findOne({
      where: { id },
      relations: ['application', 'observation'],
    });

    if (!link) {
      throw new NotFoundException('Request Observation not found');
    }

    // Cambiar application
    if (dto.application_id) {
      const app = await this.appRepository.findOne({
        where: { id: dto.application_id },
      });

      if (!app) throw new NotFoundException('Application not found');

      link.application = app;
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

    await this.requestObservationRepository.save(link);

    return { message: 'Request Observation updated successfully' };
  }

  async remove(id: number) {
    const link = await this.requestObservationRepository.findOne({
      where: { id },
    });

    if (!link) {
      throw new NotFoundException('Request Observation not found');
    }

    await this.requestObservationRepository.remove(link);

    return { message: 'Request Observation deleted successfully' };
  }
}
