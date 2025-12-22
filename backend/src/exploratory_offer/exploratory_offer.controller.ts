import { Controller, Get, Post, Body, Param, Patch, Delete, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { ExploratoryOfferService } from './exploratory_offer.service';
import { ExploratoryOfferEntity } from './exploratory_offer.entity';
import { CreateExploratoryOfferDto, ExploratoryOfferResponseDto, UpdateExploratoryOfferDto } from './dtos';

@Controller('exploratory_offer')
export class ExploratoryOfferController {
  constructor(private readonly offerService: ExploratoryOfferService) {}

  @Post()
  async createExploratoryOffer(
    @Body() dto: CreateExploratoryOfferDto,
  ): Promise<{ message: string; data: ExploratoryOfferEntity }> {
    return this.offerService.create(dto);
  }

  @Get()
  async getExploratoryOffers(
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<ExploratoryOfferResponseDto[]> {
    return this.offerService.findAll(limit, offset); 
  }

  @Get(':id')
  async getExploratoryOffer(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ExploratoryOfferResponseDto> {
    return this.offerService.findOne(id);
  }

  @Patch(':id')
  async updateExploratoryOffer(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateExploratoryOfferDto,
  ): Promise<{ message: string }> {
    return this.offerService.update(id, dto);
  }

  @Delete(':id')
  async deleteExploratoryOffer(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.offerService.remove(id);
  }
}
