import { Controller, Get, Post, Body, Param, Patch, Delete, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { ManufacturerStatusService } from './manufacturer_status.service';
import { ManufacturerStatusEntity } from './manufacturer_status.entity';
import { CreateManufacturerStatusDto, ManufacturerStatusResponseDto, UpdateManufacturerStatusDto } from './dtos';

@Controller('manufacturer_status')
export class ManufacturerStatusController {
  constructor(private readonly statusService: ManufacturerStatusService) {}

  @Post()
  async createManufacturerStatus(
    @Body() dto: CreateManufacturerStatusDto,
  ): Promise<{ message: string; data: ManufacturerStatusEntity }> {
    return this.statusService.create(dto);
  }

  @Get()
  async getManufacturerStates(
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<ManufacturerStatusResponseDto[]> {
    return this.statusService.findAll(limit, offset); 
  }

  @Get(':id')
  async getManufacturerStatus(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ManufacturerStatusResponseDto> {
    return this.statusService.findOne(id);
  }

  @Patch(':id')
  async updateManufacturerStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateManufacturerStatusDto,
  ): Promise<{ message: string }> {
    return this.statusService.update(id, dto);
  }

  @Delete(':id')
  async deleteManufacturerStatus(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.statusService.remove(id);
  }
}
