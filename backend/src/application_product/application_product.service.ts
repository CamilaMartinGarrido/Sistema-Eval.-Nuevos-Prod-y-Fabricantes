import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationEntity } from './application.entity';
import { ClientEntity } from '../client/client.entity';
import { ProductEntity } from '../product/product.entity';
import { CreateApplicationDto, UpdateApplicationDto, ApplicationResponseDto } from './dtos';
import { toDto } from 'src/common/utils/mapper.util';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(ApplicationEntity)
    private readonly applicationRepository: Repository<ApplicationEntity>,

    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
  ) {}

  async create(dto: CreateApplicationDto): Promise<{ message: string; data: ApplicationEntity }> {
    const client = await this.clientRepository.findOne({ where: { id: dto.client_id } });
    if (!client) throw new NotFoundException('Client not found');

    const application = this.applicationRepository.create({
      application_number: dto.application_number,
      origin: dto.origin,
      receipt_date: dto.receipt_date,
      is_selected: dto.is_selected,
      client,
    });

    const created = await this.applicationRepository.save(application);
    
    return { 
      message: 'Application created successfully',
      data: created,
    }
  }

  async findAll(limit = 100, offset = 0): Promise<ApplicationResponseDto[]> {
    const applications = await this.applicationRepository.find({
      take: limit,
      skip: offset,
      relations: [
        'client',
        'request_observs',
        'request_observs.observation',      
      ],
    });

    return Promise.all(
      applications.map(async (a) => this.toResponseDto(a)),
    );
  }

  async findOne(id: number): Promise<ApplicationResponseDto> {
    const application = await this.applicationRepository.findOne({ 
      where: { id }, 
      relations: [
        'client',
        'request_observs',
        'request_observs.observation', 
      ] });
    if (!application) throw new NotFoundException('Application not found');
    
    return this.toResponseDto(application);
  }

  private async toResponseDto(entity: ApplicationEntity): Promise<ApplicationResponseDto> {
    return toDto(ApplicationResponseDto, entity);
  }

  async update(id: number, dto: UpdateApplicationDto) {
    const application = await this.applicationRepository.findOne({
      where: { id },
      relations: ['client'],
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (dto.client_id) {
      const client = await this.clientRepository.findOne({ where: { id: dto.client_id } });
      if (!client) throw new NotFoundException('Client not found');
      application.client = client;
    }

    if (dto.application_number !== undefined) {
      application.application_number = dto.application_number;
    }

    if (dto.origin !== undefined) {
      application.origin = dto.origin;
    }

    if (dto.receipt_date !== undefined) {
      application.receipt_date = dto.receipt_date;
    }

    if (dto.is_selected !== undefined) {
      application.is_selected = dto.is_selected;
    }

    await this.applicationRepository.save(application);

    return { message: 'Application updated successfully' };
  }

  async remove(id: number): Promise<{ message: string }> {
    const application = await this.applicationRepository.findOne({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    await this.applicationRepository.remove(application);

    return { message: 'Application deleted successfully' };
  }
}
