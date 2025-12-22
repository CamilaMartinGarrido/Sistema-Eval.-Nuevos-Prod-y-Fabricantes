import { Controller, Get, Post, Body, Param, Delete, Query, DefaultValuePipe, ParseIntPipe, Patch } from '@nestjs/common';
import { MakerProductService } from './maker_product.service';
import { CreateMakerProductDto, MakerProductResponseDto, UpdateMakerProductDto } from './dtos';

@Controller('maker_product')
export class MakerProductController {
  constructor(private readonly mpService: MakerProductService) {}

  @Post()
  async createMakerProduct(
    @Body() dto: CreateMakerProductDto,
  ): Promise<{
    message: string;
    data: Promise<MakerProductResponseDto>;
  }> {
    return this.mpService.create(dto);
  }

  @Get()
  async getMakerProducts(
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<MakerProductResponseDto[]> {
    return this.mpService.findAll(limit, offset); 
  }

  @Get(':id')
  async getMakerProduct(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MakerProductResponseDto> {
    return this.mpService.findOne(id);
  }
  
  @Patch(':id')
  async updateMakerProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMakerProductDto,
  ): Promise<{ message: string; }> {
    return this.mpService.update(id, dto);
  }
  
  @Delete(':id')
  async deleteMakerProduct(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.mpService.remove(id);
  }
}
