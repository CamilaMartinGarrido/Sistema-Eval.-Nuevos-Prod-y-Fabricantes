import { Controller, Get, Post, Body, Param, Patch, Delete, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { IndustrialPurchaseObservationService } from './industrial_purchase_observation.service';
import { CreateIndustrialPurchaseObservationDto, IndustrialPurchaseObservationResponseDto, UpdateIndustrialPurchaseObservationDto } from './dtos';
import { IndustrialPurchaseObservationEntity } from './industrial_purchase_observation.entity';

@Controller('industrial_purchase_observation')
export class IndustrialPurchaseObservationController {
  constructor(private readonly purchaseObservService: IndustrialPurchaseObservationService) {}

@Post()
  async createIndustrialPurchaseObservation(
    @Body() dto: CreateIndustrialPurchaseObservationDto,
  ): Promise<{ message: string; data: IndustrialPurchaseObservationEntity }> {
    return this.purchaseObservService.create(dto);
  }

  @Get()
  async getIndustrialPurchaseObservations(
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<IndustrialPurchaseObservationResponseDto[]> {
    return this.purchaseObservService.findAll(limit, offset); 
  }

  @Get(':id')
  async getIndustrialPurchaseObservation(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IndustrialPurchaseObservationResponseDto> {
    return this.purchaseObservService.findOne(id);
  }

  @Patch(':id')
  async updateIndustrialPurchase(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateIndustrialPurchaseObservationDto,
  ): Promise<{ message: string }> {
    return this.purchaseObservService.update(id, dto);
  }

  @Delete(':id')
  async deleteIndustrialPurchaseObservation(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.purchaseObservService.remove(id);
  }
}
