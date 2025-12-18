import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Patch,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { TechnicalDocumentService } from './technical_document.service';
import { CreateTechnicalDocumentDto, TechnicalDocumentResponseDto, UpdateTechnicalDocumentDto } from './dtos';
import { TechnicalDocumentEntity } from './technical_document.entity';

@Controller('technical_document')
export class TechnicalDocumentController {
  constructor(private readonly tecDocumentService: TechnicalDocumentService) {}

  @Post()
  async createTechnicalDocument(
    @Body() dto: CreateTechnicalDocumentDto,
  ): Promise<{ message: string; data: TechnicalDocumentEntity }> {
    return this.tecDocumentService.create(dto);
  }

  @Get()
  async getTechnicalDocuments(
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<TechnicalDocumentResponseDto[]> {
    return this.tecDocumentService.findAll(limit, offset); 
  }

  @Get(':id')
  async getTechnicalDocument(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TechnicalDocumentResponseDto> {
    return this.tecDocumentService.findOne(id);
  }

  @Patch(':id')
  async updateTechnicalDocument(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTechnicalDocumentDto,
  ): Promise<{ message: string }> {
    return this.tecDocumentService.update(id, dto);
  }

  @Delete(':id')
  async deleteTechnicalDocument(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.tecDocumentService.remove(id);
  }
}
