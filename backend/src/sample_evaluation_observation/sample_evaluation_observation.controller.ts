import { Controller, Get, Post, Body, Param, Patch, Delete, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { SampleEvaluationObservationService } from './sample_evaluation_observation.service';
import { SampleEvaluationObservationEntity } from './sample_evaluation_observation.entity';
import { CreateSampleEvaluationObservationDto, SampleEvaluationObservationResponseDto, UpdateSampleEvaluationObservationDto } from './dtos';

@Controller('sample_evaluation_observation')
export class SampleEvaluationObservationController {
  constructor(private readonly evaluationObservService: SampleEvaluationObservationService) {}

@Post()
  async createSampleEvaluationObservation(
    @Body() dto: CreateSampleEvaluationObservationDto,
  ): Promise<{ message: string; data: SampleEvaluationObservationEntity }> {
    return this.evaluationObservService.create(dto);
  }

  @Get()
  async getSampleEvaluationObservations(
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<SampleEvaluationObservationResponseDto[]> {
    return this.evaluationObservService.findAll(limit, offset); 
  }

  @Get(':id')
  async getSampleEvaluationObservation(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SampleEvaluationObservationResponseDto> {
    return this.evaluationObservService.findOne(id);
  }

  @Patch(':id')
  async updateSampleEvaluation(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSampleEvaluationObservationDto,
  ): Promise<{ message: string }> {
    return this.evaluationObservService.update(id, dto);
  }

  @Delete(':id')
  async deleteSampleEvaluationObservation(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.evaluationObservService.remove(id);
  }
}
