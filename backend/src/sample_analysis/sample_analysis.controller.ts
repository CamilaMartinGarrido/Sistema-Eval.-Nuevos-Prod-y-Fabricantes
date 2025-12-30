import { Controller, Get, Post, Body, Param, Delete, Query, DefaultValuePipe, ParseIntPipe, Patch } from '@nestjs/common';
import { SampleAnalysisService } from './sample_analysis.service';
import { SampleAnalysisEntity } from './sample_analysis.entity';
import { CreateSampleAnalysisDto, SampleAnalysisResponseDto, UpdateSampleAnalysisDto } from './dtos';

@Controller('sample_analysis')
export class SampleAnalysisController {
  constructor(private readonly sampleAnalysisService: SampleAnalysisService) {}

  @Post()
  async createSampleAnalysis(
    @Body() dto: CreateSampleAnalysisDto,
  ): Promise<{ message: string; data: SampleAnalysisEntity }> {
    return this.sampleAnalysisService.create(dto);
  }

  @Get()
  async getSampleAnalysiss(
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<SampleAnalysisResponseDto[]> {
    return this.sampleAnalysisService.findAll(limit, offset); 
  }

  @Get(':id')
  async getSampleAnalysis(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SampleAnalysisResponseDto> {
    return this.sampleAnalysisService.findOne(id);
  }

  @Patch(':id')
  async updateSampleAnalysis(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSampleAnalysisDto,
  ): Promise<{ message: string }> {
    return this.sampleAnalysisService.update(id, dto);
  }

  @Delete(':id')
  async deleteSampleAnalysis(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.sampleAnalysisService.remove(id);
  }
}
