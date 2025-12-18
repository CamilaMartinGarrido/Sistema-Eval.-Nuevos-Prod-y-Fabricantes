import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dtos';
import { ProductEntity } from './product.entity';
import { ProductResponseDto } from './dtos/product-response-dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(@Body() dto: CreateProductDto
  ): Promise<{
    message: string;
    data: ProductEntity;
  }> {
    return this.productService.create(dto);
  }

  @Get()
  async getProducts(
    @Query('limit', ParseIntPipe) limit = 100,
    @Query('offset', ParseIntPipe) offset = 0,
  ): Promise<ProductResponseDto[]> {
    return this.productService.findAll(limit, offset);
  }

  @Get(':id')
  async getProduct(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProductResponseDto> {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ): Promise<{ message: string; }> {
    return this.productService.update(id, dto);
  }

  @Delete(':id')
  async deleteProduct(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.productService.remove(id);
  }
}
