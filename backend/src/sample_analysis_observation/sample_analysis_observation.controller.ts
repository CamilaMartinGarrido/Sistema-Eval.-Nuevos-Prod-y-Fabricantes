import { Controller, Get, Post, Body, Param, Delete, Query, DefaultValuePipe, ParseIntPipe, Patch } from '@nestjs/common';
import { SampleAnalysisObservationService } from './sample_analysis_observation.service';
import { SampleAnalysisObservationEntity } from './sample_analysis_observation.entity';
import { CreateSampleAnalysisObservationDto, SampleAnalysisObservationResponseDto, UpdateSampleAnalysisObservationDto } from './dtos';

@Controller('sample_analysis_observation')
export class SampleAnalysisObservationController {
  constructor(private readonly analysisObservService: SampleAnalysisObservationService) {}

@Post()
  async createSampleAnalysisObservation(
    @Body() dto: CreateSampleAnalysisObservationDto,
  ): Promise<{ message: string; data: SampleAnalysisObservationEntity }> {
    return this.analysisObservService.create(dto);
  }

  @Get()
  async getSampleAnalysisObservations(
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<SampleAnalysisObservationResponseDto[]> {
    return this.analysisObservService.findAll(limit, offset); 
  }

  @Get(':id')
  async getSampleAnalysisObservation(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SampleAnalysisObservationResponseDto> {
    return this.analysisObservService.findOne(id);
  }

  @Patch(':id')
  async updateSampleAnalysis(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSampleAnalysisObservationDto,
  ): Promise<{ message: string }> {
    return this.analysisObservService.update(id, dto);
  }

  @Delete(':id')
  async deleteSampleAnalysisObservation(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.analysisObservService.remove(id);
  }
}
