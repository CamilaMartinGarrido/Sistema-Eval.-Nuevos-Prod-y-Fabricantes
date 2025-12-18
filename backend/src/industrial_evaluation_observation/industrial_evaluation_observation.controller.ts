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
import { IndustrialEvaluationObservationService } from './industrial_evaluation_observation.service';
import { CreateIndustrialEvaluationObservationDto } from './dto';

@Controller('industrial_evaluation_observation')
export class IndustrialEvaluationObservationController {
  constructor(private readonly svc: IndustrialEvaluationObservationService) {}

  @Post()
  create(@Body() dto: CreateIndustrialEvaluationObservationDto) {
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
    @Body() dto: Partial<CreateIndustrialEvaluationObservationDto>,
  ) {
    return this.svc.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(+id);
  }
}
