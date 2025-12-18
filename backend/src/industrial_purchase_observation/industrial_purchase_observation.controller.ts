import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { IndustrialPurchaseObservationService } from './industrial_purchase_observation.service';
import { CreateIndustrialPurchaseObservationDto } from './dto';

@Controller('industrial_purchase_observation')
export class IndustrialPurchaseObservationController {
  constructor(private readonly svc: IndustrialPurchaseObservationService) {}

  @Post()
  create(@Body() dto: CreateIndustrialPurchaseObservationDto) {
    return this.svc.create(dto);
  }

  @Get()
  findAll(@Query('limit') limit: number, @Query('offset') offset: number) {
    return this.svc.findAll(limit ? +limit : 100, offset ? +offset : 0);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.svc.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateIndustrialPurchaseObservationDto>,
  ) {
    return this.svc.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(+id);
  }
}
