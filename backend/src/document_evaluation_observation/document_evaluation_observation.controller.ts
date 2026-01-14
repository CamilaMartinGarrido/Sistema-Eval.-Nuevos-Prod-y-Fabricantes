import { Controller, Get, Post, Body, Param, Delete, Query, DefaultValuePipe, ParseIntPipe, Patch} from '@nestjs/common';
import { DocumentEvaluationObservationService } from './document_evaluation_observation.service';
import { CreateDocumentEvaluationObservationDto, DocumentEvaluationObservationResponseDto, UpdateDocumentEvaluationObservationDto } from './dtos';
import { DocumentEvaluationObservationEntity } from './document_evaluation_observation.entity';

@Controller('document_evaluation_observation')
export class DocumentEvaluationObservationController {
  constructor(private readonly docEvalObservService: DocumentEvaluationObservationService) {}

 @Post()
  async createDocumentEvaluationObservation(
    @Body() dto: CreateDocumentEvaluationObservationDto,
  ): Promise<{ message: string; data: DocumentEvaluationObservationEntity }> {
    return this.docEvalObservService.create(dto);
  }

  @Get()
  async getDocumentEvaluationObservations(
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<DocumentEvaluationObservationResponseDto[]> {
    return this.docEvalObservService.findAll(limit, offset); 
  }

  @Get(':id')
  async getDocumentEvaluationObservation(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DocumentEvaluationObservationResponseDto> {
    return this.docEvalObservService.findOne(id);
  }

  @Patch(':id')
  async updateDocumentEvaluation(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDocumentEvaluationObservationDto,
  ): Promise<{ message: string }> {
    return this.docEvalObservService.update(id, dto);
  }

  @Delete(':id')
  async deleteDocumentEvaluationObservation(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.docEvalObservService.remove(id);
  }
}
