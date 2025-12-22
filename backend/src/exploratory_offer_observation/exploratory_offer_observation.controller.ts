import { Controller, Get, Post, Body, Param, Delete, Query, DefaultValuePipe, ParseIntPipe, Patch } from '@nestjs/common';
import { ExploratoryOfferObservationService } from './exploratory_offer_observation.service';
import { ExploratoryOfferObservationEntity } from './exploratory_offer_observation.entity';
import { CreateExploratoryOfferObservationDto, ExploratoryOfferObservationResponseDto, UpdateExploratoryOfferObservationDto } from './dtos';

@Controller('exploratory_offer_observation')
export class ExploratoryOfferObservationController {
  constructor(private readonly offerObservService: ExploratoryOfferObservationService) {}

  @Post()
  async createExploratoryOfferObservation(
    @Body() dto: CreateExploratoryOfferObservationDto,
  ): Promise<{ message: string; data: ExploratoryOfferObservationEntity }> {
    return this.offerObservService.create(dto);
  }

  @Get()
  async getExploratoryOfferObservations(
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<ExploratoryOfferObservationResponseDto[]> {
    return this.offerObservService.findAll(limit, offset); 
  }

  @Get(':id')
  async getExploratoryOfferObservation(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ExploratoryOfferObservationResponseDto> {
    return this.offerObservService.findOne(id);
  }

  @Patch(':id')
  async updateExploratoryOffer(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateExploratoryOfferObservationDto,
  ): Promise<{ message: string }> {
    return this.offerObservService.update(id, dto);
  }

  @Delete(':id')
  async deleteExploratoryOfferObservation(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.offerObservService.remove(id);
  }
}
