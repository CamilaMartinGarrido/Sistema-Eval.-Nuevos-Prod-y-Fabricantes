import { Controller, Get, Post, Body, Param, Patch, Delete, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { IndustrialPurchaseService } from './industrial_purchase.service';
import { IndustrialPurchaseEntity } from './industrial_purchase.entity';
import { CreateIndustrialPurchaseDto, IndustrialPurchaseResponseDto, UpdateIndustrialPurchaseDto } from './dtos';

@Controller('industrial_purchase')
export class IndustrialPurchaseController {
  constructor(private readonly purchaseService: IndustrialPurchaseService) {}

  @Post()
  async createIndustrialPurchase(
    @Body() dto: CreateIndustrialPurchaseDto,
  ): Promise<{ message: string; data: IndustrialPurchaseEntity }> {
    return this.purchaseService.create(dto);
  }

  @Get()
  async getIndustrialPurchases(
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<IndustrialPurchaseResponseDto[]> {
    return this.purchaseService.findAll(limit, offset); 
  }

  @Get(':id')
  async getIndustrialPurchase(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IndustrialPurchaseResponseDto> {
    return this.purchaseService.findOne(id);
  }

  @Patch(':id')
  async updateIndustrialPurchase(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateIndustrialPurchaseDto,
  ): Promise<{ message: string }> {
    return this.purchaseService.update(id, dto);
  }

  @Delete(':id')
  async deleteIndustrialPurchase(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.purchaseService.remove(id);
  }
}
