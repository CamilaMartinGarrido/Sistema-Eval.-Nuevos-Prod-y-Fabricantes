import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { CreateApplicationDto, UpdateApplicationDto, ApplicationResponseDto } from './dtos';
import { ApplicationService } from './application.service';
import { ApplicationEntity } from './application.entity';

@Controller('application')
export class ApplicationController {
  constructor(private readonly appService: ApplicationService) {}

  @Post()
  async createApplication(
    @Body() dto: CreateApplicationDto,
  ): Promise<{ message: string; data: ApplicationEntity }> {
    return this.appService.create(dto);
  }

  @Get()
  async getApplications(
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<ApplicationResponseDto[]> {
    return this.appService.findAll(limit, offset); 
  }

  @Get(':id')
  async getApplication(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApplicationResponseDto> {
    return this.appService.findOne(id);
  }

  @Patch(':id')
  async updateApplication(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateApplicationDto,
  ): Promise<{ message: string }> {
    return this.appService.update(id, dto);
  }

  @Delete(':id')
  async deleteApplication(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.appService.remove(id);
  }
}
