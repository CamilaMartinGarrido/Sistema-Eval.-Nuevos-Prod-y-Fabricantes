import { Controller, Get, Post, Body, Param, Delete, Query, DefaultValuePipe, ParseIntPipe, Patch } from '@nestjs/common';
import { SampleService } from './sample.service';
import { SampleEntity } from './sample.entity';
import { CreateSampleDto, SampleResponseDto, UpdateSampleDto } from './dtos';

@Controller('sample')
export class SampleController {
  constructor(private readonly sampleService: SampleService) {}

  @Post()
  async createSample(
    @Body() dto: CreateSampleDto,
  ): Promise<{ message: string; data: SampleEntity }> {
    return this.sampleService.create(dto);
  }

  @Get()
  async getSamples(
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<SampleResponseDto[]> {
    return this.sampleService.findAll(limit, offset); 
  }

  @Get(':id')
  async getSample(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SampleResponseDto> {
    return this.sampleService.findOne(id);
  }

  @Patch(':id')
  async updateSample(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSampleDto,
  ): Promise<{ message: string }> {
    return this.sampleService.update(id, dto);
  }

  @Delete(':id')
  async deleteSample(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.sampleService.remove(id);
  }
}
