import { Controller, Get, Post, Body, Param, Delete, Query, DefaultValuePipe, ParseIntPipe, Patch } from '@nestjs/common';
import { EvaluationProcessService } from './evaluation_process.service';
import { CreateEvaluationProcessDto, EvaluationProcessResponseDto, UpdateEvaluationProcessDto } from './dtos';
import { EvaluationProcessEntity } from './evaluation_process.entity';

@Controller('evaluation_process')
export class EvaluationProcessController {
  constructor(private readonly evaluationProcessService: EvaluationProcessService) {}

  @Post()
  async createEvaluationProcess(
    @Body() dto: CreateEvaluationProcessDto,
  ): Promise<{ message: string; data: EvaluationProcessEntity;
  }> {
    return this.evaluationProcessService.create(dto);
  }

  @Get()
  async getClientEvaluationProcesses(
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<EvaluationProcessResponseDto[]> {
    return this.evaluationProcessService.findAll(limit, offset); 
  }

  @Get(':id')
  async getEvaluationProcess(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<EvaluationProcessResponseDto> {
    return this.evaluationProcessService.findOne(id);
  }

  @Patch(':id')
  async updateEvaluationProcess(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEvaluationProcessDto,
  ): Promise<{ message: string }> {
    return this.evaluationProcessService.update(id, dto);
  }

  @Delete(':id')
  async deleteEvaluationProcess(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.evaluationProcessService.remove(id);
  }
}
