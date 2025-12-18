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
import { IndustrialPurchaseService } from './industrial_purchase.service';
import { CreateIndustrialPurchaseDto } from './dto';

@Controller('industrial_purchase')
export class IndustrialPurchaseController {
  constructor(private readonly svc: IndustrialPurchaseService) {}

  @Post()
  create(@Body() dto: CreateIndustrialPurchaseDto) {
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
    @Body() dto: Partial<CreateIndustrialPurchaseDto>,
  ) {
    return this.svc.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(+id);
  }
}
