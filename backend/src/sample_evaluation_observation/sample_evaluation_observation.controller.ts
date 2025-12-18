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
import { SampleEvaluationObservationService } from './sample_evaluation_observation.service';
import { CreateSampleEvaluationObservationDto } from './dto';

@Controller('sample_evaluation_observation')
export class SampleEvaluationObservationController {
  constructor(private readonly svc: SampleEvaluationObservationService) {}

  @Post()
  create(@Body() dto: CreateSampleEvaluationObservationDto) {
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
    @Body() dto: Partial<CreateSampleEvaluationObservationDto>,
  ) {
    return this.svc.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(+id);
  }
}
