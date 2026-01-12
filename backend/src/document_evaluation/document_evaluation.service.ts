import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentEvaluationEntity } from './document_evaluation.entity';
import { EvaluationProcessEntity } from '../evaluation_process/evaluation_process.entity';
import { TechnicalDocumentEntity } from '../technical_document/technical_document.entity';
import { CreateDocumentEvaluationDto, DocumentEvaluationResponseDto, UpdateDocumentEvaluationDto } from './dtos';
import { toDto } from 'src/common/utils/mapper.util';

@Injectable()
export class DocumentEvaluationService {
  constructor(
    @InjectRepository(DocumentEvaluationEntity)
    private readonly documentEvaluationRepository: Repository<DocumentEvaluationEntity>,

    @InjectRepository(EvaluationProcessEntity)
    private readonly evaluationProcessRepository: Repository<EvaluationProcessEntity>,

    @InjectRepository(TechnicalDocumentEntity)
    private readonly technicalDocumentRepository: Repository<TechnicalDocumentEntity>,
  ) {}

  async create(dto: CreateDocumentEvaluationDto): Promise<{ message: string; data: DocumentEvaluationEntity }> {
    const evaluation_process = await this.evaluationProcessRepository.findOne({ where: { id: dto.evaluation_process_id } });
    if (!evaluation_process) throw new NotFoundException('Evaluation Process not found');

    const technical_document = await this.technicalDocumentRepository.findOne({ where: { id: dto.technical_document_id } });
    if (!technical_document) throw new NotFoundException('Technical Document not found');

    const evaluation = this.documentEvaluationRepository.create({
      evaluation_process,
      technical_document,
      send_date: dto.send_date,
      evaluation_date: dto.evaluation_date,
      is_approved: dto.is_approved,
    });

    const created = await this.documentEvaluationRepository.save(evaluation);
    
    return { 
      message: 'Document Evaluation created successfully',
      data: created,
    }
  }

  async findAll(limit = 100, offset = 0): Promise<DocumentEvaluationResponseDto[]> {
    const evaluations = await this.documentEvaluationRepository.find({
      take: limit,
      skip: offset,
      relations: ['evaluation_process', 'technical_document'],
    });

    return Promise.all(
      evaluations.map(async (e) => this.toResponseDto(e)),
    );
  }

  async findOne(id: number): Promise<DocumentEvaluationResponseDto> {
    const evaluation = await this.documentEvaluationRepository.findOne({ 
      where: { id }, relations: ['evaluation_process', 'technical_document'] });
    if (!evaluation) throw new NotFoundException('Document Evaluation not found');
    
    return this.toResponseDto(evaluation);
  }

  private async toResponseDto(entity: DocumentEvaluationEntity): Promise<DocumentEvaluationResponseDto> {
    return toDto(DocumentEvaluationResponseDto, entity);
  }

  async update(id: number, dto: UpdateDocumentEvaluationDto) {
    const evaluation = await this.documentEvaluationRepository.findOne({
      where: { id },
      relations: ['evaluation_process', 'technical_document'],
    });

    if (!evaluation) {
      throw new NotFoundException('Document Evaluation not found');
    }

    if (dto.evaluation_process_id) {
      const evaluation_process = await this.evaluationProcessRepository.findOne({ where: { id: dto.evaluation_process_id } });
      if (!evaluation_process) throw new NotFoundException('Evaluation Process not found');
      evaluation.evaluation_process = evaluation_process;
    }

    if (dto.technical_document_id) {
      const technical_document = await this.technicalDocumentRepository.findOne({ where: { id: dto.technical_document_id } });
      if (!technical_document) throw new NotFoundException('Technical Document not found');
      evaluation.technical_document = technical_document;
    }

    if (dto.send_date !== undefined) {
      evaluation.send_date = dto.send_date;
    }

    if (dto.evaluation_date !== undefined) {
      evaluation.evaluation_date = dto.evaluation_date;
    }

    if (dto.is_approved !== undefined) {
      evaluation.is_approved = dto.is_approved;
    }

    const updated = await this.documentEvaluationRepository.save(evaluation);

    return { message: 'Document Evaluation updated successfully' };
  }

  async remove(id: number): Promise<{ message: string }> {
    const evaluation = await this.documentEvaluationRepository.findOne({
      where: { id },
    });

    if (!evaluation) {
      throw new NotFoundException('Document Evaluation not found');
    }

    await this.documentEvaluationRepository.remove(evaluation);

    return { message: 'Document Evaluation deleted successfully' };
  }
}
