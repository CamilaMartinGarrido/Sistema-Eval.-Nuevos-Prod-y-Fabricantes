import { Controller, Get, Post, Body, Param, Patch, Delete, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { SupplierPurchaseService } from './supplier_purchase.service';
import { CreateSupplierPurchaseDto, SupplierPurchaseResponseDto, UpdateSupplierPurchaseDto } from './dtos';
import { SupplierPurchaseEntity } from './supplier_purchase.entity';

@Controller('supplier_purchase')
export class SupplierPurchaseController {
  constructor(private readonly supplierPurchaseService: SupplierPurchaseService) {}

  @Post()
  async createSupplierPurchase(
    @Body() dto: CreateSupplierPurchaseDto,
  ): Promise<{ message: string; data: SupplierPurchaseEntity }> {
    return this.supplierPurchaseService.create(dto);
  }

  @Get()
  async getSupplierPurchases(
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<SupplierPurchaseResponseDto[]> {
    return this.supplierPurchaseService.findAll(limit, offset); 
  }

  @Get(':id')
  async getSupplierPurchase(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SupplierPurchaseResponseDto> {
    return this.supplierPurchaseService.findOne(id);
  }

  @Patch(':id')
  async updateSupplierPurchase(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSupplierPurchaseDto,
  ): Promise<{ message: string }> {
    return this.supplierPurchaseService.update(id, dto);
  }

  @Delete(':id')
  async deleteSupplierPurchase(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.supplierPurchaseService.remove(id);
  }
}
