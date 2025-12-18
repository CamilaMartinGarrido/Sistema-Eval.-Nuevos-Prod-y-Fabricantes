import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ObservationService } from './observation.service';
import { CreateObservationDto, ObservationResponseDto, UpdateObservationDto } from './dtos';
import { ObservationEntity } from './observation.entity';

@Controller('observation')
export class ObservationController {
  constructor(
    private readonly observationService: ObservationService
  ) {}

@Post()
  async createObservation(
    @Body() dto: CreateObservationDto,
  ): Promise<{ message: string; data: ObservationEntity; }> {
    return this.observationService.create(dto);
  }

  @Get()
  async getObservations(
    @Query('limit', ParseIntPipe) limit = 100,
    @Query('offset', ParseIntPipe) offset = 0,
  ): Promise<ObservationResponseDto[]> {
    return this.observationService.findAll(limit, offset);
  }

  @Get(':id')
  async getObservation(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ObservationResponseDto> {
    return this.observationService.findOne(id);
  }

  @Patch(':id')
  async updateObservation(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateObservationDto,
  ): Promise<{ message: string }> {
    return this.observationService.update(id, dto);
  }

  @Delete(':id')
  async deleteObservation(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.observationService.remove(id);
  }
}
