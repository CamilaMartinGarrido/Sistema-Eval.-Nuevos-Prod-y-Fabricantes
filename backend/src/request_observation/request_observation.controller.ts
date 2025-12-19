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
import { RequestObservationService } from './request_observation.service';
import { CreateRequestObservationDto, RequestObservationResponseDto, UpdateRequestObservationDto } from './dtos';
import { RequestObservationEntity } from './request_observation.entity';

@Controller('request_observation')
export class RequestObservationController {
  constructor(private readonly requestObservService: RequestObservationService) {}

 @Post()
  async createRequestObservation(
    @Body() dto: CreateRequestObservationDto,
  ): Promise<{ message: string; data: RequestObservationEntity }> {
    return this.requestObservService.create(dto);
  }

  @Get()
  async getRequestObservations(
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<RequestObservationResponseDto[]> {
    return this.requestObservService.findAll(limit, offset); 
  }

  @Get(':id')
  async getERequestObservation(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<RequestObservationResponseDto> {
    return this.requestObservService.findOne(id);
  }

  @Patch(':id')
  async updateExploratoryOffer(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRequestObservationDto,
  ): Promise<{ message: string }> {
    return this.requestObservService.update(id, dto);
  }

  @Delete(':id')
  async deleteRequestObservation(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.requestObservService.remove(id);
  }
}
