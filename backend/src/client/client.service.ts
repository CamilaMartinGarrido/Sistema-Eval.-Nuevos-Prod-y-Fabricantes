import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientEntity } from './client.entity';
import { CreateClientDto, UpdateClientDto } from './dtos';
import { toDto } from 'src/common/utils/mapper.util';
import { ClientResponseDto } from './dtos/client-response-dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
  ) {}

  async create(dto: CreateClientDto): Promise<{ message: string; data: ClientEntity }> {
    const client = this.clientRepository.create(dto);
    const created = await this.clientRepository.save(client);
    
    return { 
      message: 'Client created successfully',
      data: created
    };
  }

  async findAll(limit = 100, offset = 0) {
    const clients = await this.clientRepository.find({ take: limit, skip: offset });

    return Promise.all(
      clients.map(async (a) => this.toResponseDto(a)),
    );
  }

  async findOne(id: number) {
    const client = await this.clientRepository.findOneBy({ id });
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    return this.toResponseDto(client);
  }

  private async toResponseDto(entity: ClientEntity): Promise<ClientResponseDto> {
    return toDto(ClientResponseDto, entity);
  }

  async update(id: number, dto: UpdateClientDto) {
    const result = await this.clientRepository.update(id, dto);
    if (result.affected === 0) {
      throw new NotFoundException('Client could not be updated');
    }
    return { message: 'Client updated successfully' };
  }

  async remove(id: number) {
    const client = await this.clientRepository.findOneBy({ id });
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    await this.clientRepository.remove(client);
    return { message: 'Client deleted successfully' };
  }
}
