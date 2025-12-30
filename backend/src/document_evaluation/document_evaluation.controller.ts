import { Controller, Get, Post, Body, Param, Delete, Query, DefaultValuePipe, ParseIntPipe, Patch } from '@nestjs/common';
import { DocumentEvaluationService } from './document_evaluation.service';
import { DocumentEvaluationEntity } from './document_evaluation.entity';
import { CreateDocumentEvaluationDto, DocumentEvaluationResponseDto, UpdateDocumentEvaluationDto } from './dtos';

@Controller('document_evaluation')
export class DocumentEvaluationController {
  constructor(private readonly documentEvalService: DocumentEvaluationService) {}

@Post()
  async createDocumentEvaluation(
    @Body() dto: CreateDocumentEvaluationDto,
  ): Promise<{ message: string; data: DocumentEvaluationEntity }> {
    return this.documentEvalService.create(dto);
  }

  @Get()
  async getDocumentEvaluations(
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<DocumentEvaluationResponseDto[]> {
    return this.documentEvalService.findAll(limit, offset); 
  }

  @Get(':id')
  async getDocumentEvaluation(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DocumentEvaluationResponseDto> {
    return this.documentEvalService.findOne(id);
  }

  @Patch(':id')
  async updateDocumentEvaluation(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDocumentEvaluationDto,
  ): Promise<{ message: string }> {
    return this.documentEvalService.update(id, dto);
  }

  @Delete(':id')
  async deleteDocumentEvaluation(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.documentEvalService.remove(id);
  }
}
