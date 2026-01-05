import { Controller, Get, Post, Body, Param, Patch, Delete, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { IndustrialEvaluationService } from './industrial_evaluation.service';
import { IndustrialEvaluationEntity } from './industrial_evaluation.entity';
import { CreateIndustrialEvaluationDto, IndustrialEvaluationResponseDto, UpdateIndustrialEvaluationDto } from './dtos';

@Controller('industrial_evaluation')
export class IndustrialEvaluationController {
  constructor(private readonly evaluationService: IndustrialEvaluationService) {}

  @Post()
  async createIndustrialEvaluation(
    @Body() dto: CreateIndustrialEvaluationDto,
  ): Promise<{ message: string; data: IndustrialEvaluationEntity }> {
    return this.evaluationService.create(dto);
  }

  @Get()
  async getIndustrialEvaluations(
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<IndustrialEvaluationResponseDto[]> {
    return this.evaluationService.findAll(limit, offset); 
  }

  @Get(':id')
  async getIndustrialEvaluation(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IndustrialEvaluationResponseDto> {
    return this.evaluationService.findOne(id);
  }

  @Patch(':id')
  async updateIndustrialEvaluation(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateIndustrialEvaluationDto,
  ): Promise<{ message: string }> {
    return this.evaluationService.update(id, dto);
  }

  @Delete(':id')
  async deleteIndustrialEvaluation(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.evaluationService.remove(id);
  }
}
