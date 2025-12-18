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
import { SampleAnalysisObservationService } from './sample_analysis_observation.service';
import { CreateSampleAnalysisObservationDto } from './dto';

@Controller('sample_analysis_observation')
export class SampleAnalysisObservationController {
  constructor(private readonly svc: SampleAnalysisObservationService) {}

  @Post()
  create(@Body() dto: CreateSampleAnalysisObservationDto) {
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
    @Body() dto: Partial<CreateSampleAnalysisObservationDto>,
  ) {
    return this.svc.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(+id);
  }
}
