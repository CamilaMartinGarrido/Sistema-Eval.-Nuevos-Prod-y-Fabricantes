import { Controller, Get, Post, Body, Param, Delete, Query, DefaultValuePipe, ParseIntPipe, Patch } from '@nestjs/common';
import { SampleEvaluationService } from './sample_evaluation.service';
import { SampleEvaluationEntity } from './sample_evaluation.entity';
import { CreateSampleEvaluationDto, SampleEvaluationResponseDto, UpdateSampleEvaluationDto } from './dtos';

@Controller('sample_evaluation')
export class SampleEvaluationController {
  constructor(private readonly sampleEvaluationService: SampleEvaluationService) {}

  @Post()
  async createSampleEvaluation(
    @Body() dto: CreateSampleEvaluationDto,
  ): Promise<{ message: string; data: SampleEvaluationEntity }> {
    return this.sampleEvaluationService.create(dto);
  }

  @Get()
  async getSampleEvaluations(
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<SampleEvaluationResponseDto[]> {
    return this.sampleEvaluationService.findAll(limit, offset); 
  }

  @Get(':id')
  async getSampleEvaluation(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SampleEvaluationResponseDto> {
    return this.sampleEvaluationService.findOne(id);
  }

  @Patch(':id')
  async updateSampleEvaluation(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSampleEvaluationDto,
  ): Promise<{ message: string }> {
    return this.sampleEvaluationService.update(id, dto);
  }

  @Delete(':id')
  async deleteSampleEvaluation(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.sampleEvaluationService.remove(id);
  }
}
