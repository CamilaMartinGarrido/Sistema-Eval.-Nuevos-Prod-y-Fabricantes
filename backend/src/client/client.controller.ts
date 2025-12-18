import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto, UpdateClientDto } from './dtos';
import { ClientEntity } from './client.entity';
import { ClientResponseDto } from './dtos/client-response-dto';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  async createClient(
    @Body() dto: CreateClientDto
  ): Promise<{ message: string; data: ClientEntity; }> {
    return this.clientService.create(dto);
  }

  @Get()
  async getClients(
    @Query('limit', ParseIntPipe) limit = 100,
    @Query('offset', ParseIntPipe) offset = 0,
  ): Promise<ClientResponseDto[]> {
    return this.clientService.findAll(limit, offset);
  }

  @Get(':id')
  async getClient(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ClientResponseDto> {
    return this.clientService.findOne(id);
  }

  @Patch(':id')
  async updateClient(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateClientDto,
  ): Promise<{ message: string; }> {
    return this.clientService.update(id, dto);
  }

  @Delete(':id')
  async deleteClient(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.clientService.remove(id);
  }
}
