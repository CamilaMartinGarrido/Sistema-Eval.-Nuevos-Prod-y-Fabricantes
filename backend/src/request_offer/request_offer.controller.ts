import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { RequestOfferService } from './request_offer.service';
import { CreateRequestOfferDto, RequestOfferResponseDto, UpdateRequestOfferDto } from './dtos';
import { RequestOfferEntity } from './request_offer.entity';

@Controller('request_offer')
export class RequestOfferController {
  constructor(private readonly requestOfferService: RequestOfferService) {}

  @Post()
  async createRequestOffer(
    @Body() dto: CreateRequestOfferDto,
  ): Promise<{ message: string; data: RequestOfferEntity }> {
    return this.requestOfferService.create(dto);
  }

  @Get()
  async getRequestOffers(
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<RequestOfferResponseDto[]> {
    return this.requestOfferService.findAll(limit, offset); 
  }

  @Get(':id')
  async getRequestOffer(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<RequestOfferResponseDto> {
    return this.requestOfferService.findOne(id);
  }

  @Patch(':id')
  async updateRequestOffer(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRequestOfferDto,
  ): Promise<{ message: string }> {
    return this.requestOfferService.update(id, dto);
  }

  @Delete(':id')
  async deleteRequestOffer(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.requestOfferService.remove(id);
  }
}
