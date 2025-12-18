import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { MakerService } from './maker.service';
import { CreateMakerDto, MakerResponseDto, UpdateMakerDto } from './dtos';

@Controller('maker')
export class MakerController {
  constructor(
    private readonly makerService: MakerService,
  ) {}

  @Post()
  async createMaker(
    @Body() dto: CreateMakerDto,
  ): Promise<{ message: string }> {
    return this.makerService.create(dto);
  }

  @Get()
  async getMakers(
    @Query('limit', ParseIntPipe) limit = 100,
    @Query('offset', ParseIntPipe) offset = 0,
  ): Promise<MakerResponseDto[]> {
    return this.makerService.findAll(limit, offset);
  }

  @Get(':id')
  async getMaker(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MakerResponseDto> {
    return this.makerService.findOne(id);
  }

  @Patch(':id')
  async updateMaker(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMakerDto,
  ): Promise<{ message: string }> {
    return this.makerService.update(id, dto);
  }

  @Delete(':id')
  async deleteMaker(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.makerService.remove(id);
  }
}
