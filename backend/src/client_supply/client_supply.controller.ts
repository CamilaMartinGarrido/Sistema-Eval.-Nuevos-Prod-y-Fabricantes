import { Controller, Get, Post, Body, Param, Delete, Query, DefaultValuePipe, ParseIntPipe, Patch } from '@nestjs/common';
import { ClientSupplyService } from './client_supply.service';
import { ClientSupplyResponseDto, CreateClientSupplyDto, UpdateClientSupplyDto } from './dtos';

@Controller('client_supply')
export class ClientSupplyController {
  constructor(private readonly csService: ClientSupplyService) {}

  @Post()
  async createClientSupply(
    @Body() dto: CreateClientSupplyDto,
  ): Promise<{
    message: string;
    data: Promise<ClientSupplyResponseDto>;
  }> {
    return this.csService.create(dto);
  }

  @Get()
  async getClientSupplies(
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<ClientSupplyResponseDto[]> {
    return this.csService.findAll(limit, offset); 
  }

  @Get(':id')
  async getClientSupply(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ClientSupplyResponseDto> {
    return this.csService.findOne(id);
  }

  @Patch(':id')
  async updateClientSupply(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateClientSupplyDto,
  ): Promise<{ message: string }> {
    return this.csService.update(id, dto);
  }

  @Delete(':id')
  async deleteClientSupply(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.csService.remove(id);
  }
}
