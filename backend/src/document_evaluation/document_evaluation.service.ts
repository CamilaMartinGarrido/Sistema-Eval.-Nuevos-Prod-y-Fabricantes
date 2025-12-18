import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentEvaluationEntity } from './document_evaluation.entity';
import { CreateDocumentEvaluationDto } from './dto';

@Injectable()
export class DocumentEvaluationService {
  constructor(
    @InjectRepository(DocumentEvaluationEntity)
    private readonly documentEvaluationRepository: Repository<DocumentEvaluationEntity>,
  ) {}

  create(dto: CreateDocumentEvaluationDto) {
    const e = this.documentEvaluationRepository.create(dto);
    return this.documentEvaluationRepository.save(e);
  }

  findAll(limit = 100, offset = 0) {
    return this.documentEvaluationRepository.find({
      take: limit,
      skip: offset,
    });
  }

  findOne(id: number) {
    return this.documentEvaluationRepository.findOneBy({ id });
  }

  async update(id: number, dto: Partial<CreateDocumentEvaluationDto>) {
    await this.documentEvaluationRepository.update(id, dto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.documentEvaluationRepository.delete(id);
  }
}
