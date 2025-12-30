import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientSupplyEntity } from './client_supply.entity';
import { ClientEntity } from '../client/client.entity';
import { SupplyEntity } from '../supply/supply.entity';
import { ApplicationEntity } from '../application/application.entity';
import { ClientSupplyResponseDto, CreateClientSupplyDto, UpdateClientSupplyDto } from './dtos';
import { toDto } from 'src/common/utils/mapper.util';

@Injectable()
export class ClientSupplyService {
  constructor(
    @InjectRepository(ClientSupplyEntity)
    private readonly clientSupplyRepository: Repository<ClientSupplyEntity>,

    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,

    @InjectRepository(SupplyEntity)
    private readonly supplyRepository: Repository<SupplyEntity>,

    @InjectRepository(ApplicationEntity)
    private readonly appRepository: Repository<ApplicationEntity>,
  ) {}

  async create(dto: CreateClientSupplyDto): Promise<{ message: string; data: ClientSupplyEntity }> {
    const client = await this.clientRepository.findOne({ where: { id: dto.client_id } });
    if (!client) throw new NotFoundException('Client not found');
            
    const supply = await this.supplyRepository.findOne({ where: { id: dto.supply_id } });
    if (!supply) throw new NotFoundException('Supply not found');

    const application = await this.appRepository.findOne({ where: { id: dto.application_id } });
    if (!application) throw new NotFoundException('Application not found');
            
    const client_supply = this.clientSupplyRepository.create({
      client,
      supply,
      application,
    });
        
    const saved = await this.clientSupplyRepository.save(client_supply);
        
    return {
      message: 'ClientSupply created successfully',
      data: saved,
    }
  }

  async findAll(limit = 100, offset = 0): Promise<ClientSupplyResponseDto[]> {
    const client_supplies = await this.clientSupplyRepository.find({
      take: limit,
      skip: offset,
      relations: ['client', 'supply', 'application'],
    });
  
    return Promise.all(
      client_supplies.map(async (client_supply) => this.toResponseDto(client_supply)),
    );
  }

  async findOne(id: number): Promise<ClientSupplyResponseDto> {
    const client_supply = await this.clientSupplyRepository.findOne({ where: { id }, relations: ['client', 'supply', 'application'] });
    if (!client_supply) {
      throw new NotFoundException('ClientSupply not found');
    }
    
    return this.toResponseDto(client_supply);
  }

  private async toResponseDto(entity: ClientSupplyEntity): Promise<ClientSupplyResponseDto> {
    return toDto(ClientSupplyResponseDto, entity);
  }

  async update(id: number, dto: UpdateClientSupplyDto): Promise<{ message: string }> {
    const client_supply = await this.clientSupplyRepository.findOne({
      where: { id },
      relations: ['client', 'supply', 'application'],
    });

    if (!client_supply) {
      throw new NotFoundException('ClientSupply not found');
    }

    // Cambiar client si viene client_id
    if (dto.client_id) {
      const client = await this.clientRepository.findOne({ where: { id: dto.client_id } });
      if (!client) throw new NotFoundException('Client not found');
      client_supply.client = client;
    }

    // Cambiar supply si viene supply_id 
    if (dto.supply_id) {
      const supply = await this.supplyRepository.findOne({ where: { id: dto.supply_id } });
      if (!supply) throw new NotFoundException('Supply not found');
      client_supply.supply = supply;
    }

    // Cambiar application si viene application_id 
    if (dto.application_id) {
      const application = await this.appRepository.findOne({ where: { id: dto.application_id } });
      if (!application) throw new NotFoundException('Application not found');
      client_supply.application = application;
    }

    const updated = await this.clientSupplyRepository.save(client_supply);

    return { message: 'ClientSupply updated successfully' };
  }

  async remove(id: number): Promise<{ message: string }> {
    const client_supply = await this.clientSupplyRepository.findOne({
      where: { id },
    });

    if (!client_supply) {
      throw new NotFoundException('ClientSupply not found');
    }

    // Eliminar solo el ClientSupply, sin tocar client ni supply ni application
    await this.clientSupplyRepository.remove(client_supply);

    return { message: 'ClientSupply deleted successfully' };
  }
}
