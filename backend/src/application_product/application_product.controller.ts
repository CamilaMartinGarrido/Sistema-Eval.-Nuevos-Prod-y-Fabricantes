import { Controller, Get, Post, Body, Param, Patch, Delete, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ApplicationProductService } from './application_product.service';
import { ApplicationProductResponseDto, CreateApplicationProductDto, UpdateApplicationProductDto } from './dtos';
import { ApplicationProductEntity } from './application_product.entity';

@Controller('application_product')
export class ApplicationProductController {
  constructor(private readonly appProductService: ApplicationProductService) {}

  @Post()
  async createApplicationProduct(
    @Body() dto: CreateApplicationProductDto,
  ): Promise<{ message: string; data: ApplicationProductEntity }> {
    return this.appProductService.create(dto);
  }

  @Get()
  async getApplicationProducts(
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<ApplicationProductResponseDto[]> {
    return this.appProductService.findAll(limit, offset); 
  }

  @Get(':id')
  async getApplicationProduct(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApplicationProductResponseDto> {
    return this.appProductService.findOne(id);
  }

  @Patch(':id')
  async updateApplicationProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateApplicationProductDto,
  ): Promise<{ message: string }> {
    return this.appProductService.update(id, dto);
  }

  @Delete(':id')
  async deleteApplicationProduct(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.appProductService.remove(id);
  }
}
