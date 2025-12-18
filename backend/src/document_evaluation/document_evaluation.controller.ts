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
import { DocumentEvaluationService } from './document_evaluation.service';
import { CreateDocumentEvaluationDto } from './dto';

@Controller('document_evaluation')
export class DocumentEvaluationController {
  constructor(private readonly svc: DocumentEvaluationService) {}

  @Post()
  create(@Body() dto: CreateDocumentEvaluationDto) {
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
    @Body() dto: Partial<CreateDocumentEvaluationDto>,
  ) {
    return this.svc.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(+id);
  }
}
