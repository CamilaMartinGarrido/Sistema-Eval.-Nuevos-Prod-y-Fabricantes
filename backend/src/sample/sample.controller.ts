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
import { SampleService } from './sample.service';
import { CreateSampleDto } from './dto';

@Controller('sample')
export class SampleController {
  constructor(private readonly svc: SampleService) {}

  @Post()
  create(@Body() dto: CreateSampleDto) {
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
  update(@Param('id') id: string, @Body() dto: Partial<CreateSampleDto>) {
    return this.svc.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(+id);
  }
}
