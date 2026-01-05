import { Controller, Get, Post, Body, Param, Patch, Delete, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { IndustrialEvaluationObservationService } from './industrial_evaluation_observation.service';
import { CreateIndustrialEvaluationObservationDto, IndustrialEvaluationObservationResponseDto, UpdateIndustrialEvaluationObservationDto } from './dtos';
import { IndustrialEvaluationObservationEntity } from './industrial_evaluation_observation.entity';

@Controller('industrial_evaluation_observation')
export class IndustrialEvaluationObservationController {
  constructor(private readonly evaluationObservService: IndustrialEvaluationObservationService) {}

@Post()
  async createIndustrialEvaluationObservation(
    @Body() dto: CreateIndustrialEvaluationObservationDto,
  ): Promise<{ message: string; data: IndustrialEvaluationObservationEntity }> {
    return this.evaluationObservService.create(dto);
  }

  @Get()
  async getIndustrialEvaluationObservations(
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<IndustrialEvaluationObservationResponseDto[]> {
    return this.evaluationObservService.findAll(limit, offset); 
  }

  @Get(':id')
  async getIndustrialEvaluationObservation(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IndustrialEvaluationObservationResponseDto> {
    return this.evaluationObservService.findOne(id);
  }

  @Patch(':id')
  async updateIndustrialEvaluation(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateIndustrialEvaluationObservationDto,
  ): Promise<{ message: string }> {
    return this.evaluationObservService.update(id, dto);
  }

  @Delete(':id')
  async deleteIndustrialEvaluationObservation(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.evaluationObservService.remove(id);
  }
}
