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
import { CommercialEntityService } from './commercial_entity.service';
import { CreateCommercialEntityDto, UpdateCommercialEntityDto, CommercialEntityResponseDto } from './dtos';
import { CommercialEntityEntity } from './commercial_entity.entity';

@Controller('commercial_entity')
export class CommercialEntityController {
  constructor(
    private readonly commercialEntityService: CommercialEntityService,
  ) {}

  @Post()
  async createCommercialEntity(
    @Body() dto: CreateCommercialEntityDto,
  ): Promise<{ message: string; data: CommercialEntityEntity; }> {
    return this.commercialEntityService.create(dto);
  }

  @Get()
  async getCommercialEntities(
    @Query('limit', ParseIntPipe) limit = 100,
    @Query('offset', ParseIntPipe) offset = 0,
  ): Promise<CommercialEntityResponseDto[]> {
    return this.commercialEntityService.findAll(limit, offset);
  }

  @Get(':id')
  async getCommercialEntity(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CommercialEntityResponseDto> {
    return this.commercialEntityService.findOne(id);
  }

  @Patch(':id')
  async updateCommercialEntity(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCommercialEntityDto,
  ): Promise<{ message: string }> {
    return this.commercialEntityService.update(id, dto);
  }

  @Delete(':id')
  async deleteCommercialEntity(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.commercialEntityService.remove(id);
  }
}
