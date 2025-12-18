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
import { IndustrialEvaluationService } from './industrial_evaluation.service';
import { CreateIndustrialEvaluationDto } from './dto';

@Controller('industrial_evaluation')
export class IndustrialEvaluationController {
  constructor(private readonly svc: IndustrialEvaluationService) {}

  @Post()
  create(@Body() dto: CreateIndustrialEvaluationDto) {
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
    @Body() dto: Partial<CreateIndustrialEvaluationDto>,
  ) {
    return this.svc.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(+id);
  }
}
