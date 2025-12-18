import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto, SupplierResponseDto, UpdateSupplierDto } from './dtos';
import { SupplierEntity } from './supplier.entity';

@Controller('supplier')
export class SupplierController {
  constructor(
    private readonly supplierService: SupplierService,
  ) {}

  @Post()
  async createSupplier(
    @Body() dto: CreateSupplierDto,
  ): Promise<{ message: string; data: SupplierEntity; }> {
    return this.supplierService.create(dto);
  }

  @Get()
  async getSuppliers(
    @Query('limit', ParseIntPipe) limit = 100,
    @Query('offset', ParseIntPipe) offset = 0,
  ): Promise<SupplierResponseDto[]> {
    return this.supplierService.findAll(limit, offset);
  }

  @Get(':id')
  async getSupplier(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SupplierResponseDto> {
    return this.supplierService.findOne(id);
  }

  @Patch(':id')
  async updateSupplier(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSupplierDto,
  ): Promise<{ message: string }> {
    return this.supplierService.update(id, dto);
  }

  @Delete(':id')
  async deleteSupplier(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.supplierService.remove(id);
  }
}
