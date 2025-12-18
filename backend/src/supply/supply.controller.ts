import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { SupplyService } from './supply.service';
import { CreateSupplyDto, UpdateSupplyDto, SupplyResponseDto } from './dtos';

@Controller('supply')
export class SupplyController {
  constructor(private readonly supplyService: SupplyService) {}

  @Post()
  async createSupply(
    @Body() dto: CreateSupplyDto,
  ): Promise<{
    message: string;
    data: Promise<SupplyResponseDto>;
  }> {
    return this.supplyService.create(dto);
  }
  
  @Get()
  async getSupplies(
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<SupplyResponseDto[]> {
    return this.supplyService.findAll(limit, offset); 
  }
  
  @Get(':id')
  async getSupply(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SupplyResponseDto> {
    return this.supplyService.findOne(id);
  }
    
  @Patch(':id')
  async updateSupply(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSupplyDto,
  ): Promise<{ message: string }> {
    return this.supplyService.update(id, dto);
  }
    
  @Delete(':id')
  async deleteSupply(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.supplyService.remove(id);
  }
}
