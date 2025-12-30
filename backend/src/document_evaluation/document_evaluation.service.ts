import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentEvaluationEntity } from './document_evaluation.entity';
import { ClientSupplyEntity } from '../client_supply/client_supply.entity';
import { TechnicalDocumentEntity } from '../technical_document/technical_document.entity';
import { CreateDocumentEvaluationDto, DocumentEvaluationResponseDto, UpdateDocumentEvaluationDto } from './dtos';
import { toDto } from 'src/common/utils/mapper.util';

@Injectable()
export class DocumentEvaluationService {
  constructor(
    @InjectRepository(DocumentEvaluationEntity)
    private readonly documentEvaluationRepository: Repository<DocumentEvaluationEntity>,

    @InjectRepository(ClientSupplyEntity)
    private readonly clientSupplyRepository: Repository<ClientSupplyEntity>,

    @InjectRepository(TechnicalDocumentEntity)
    private readonly technicalDocumentRepository: Repository<TechnicalDocumentEntity>,
  ) {}

  async create(dto: CreateDocumentEvaluationDto): Promise<{ message: string; data: DocumentEvaluationEntity }> {
    const client_supply = await this.clientSupplyRepository.findOne({ where: { id: dto.client_supply_id } });
    if (!client_supply) throw new NotFoundException('Client Supply not found');

    const technical_document = await this.technicalDocumentRepository.findOne({ where: { id: dto.technical_document_id } });
    if (!technical_document) throw new NotFoundException('Technical Document not found');

    const evaluation = this.documentEvaluationRepository.create({
      client_supply,
      technical_document,
      evaluation_date: dto.evaluation_date,
      is_approved: dto.is_approved,
      send_date: dto.send_date,
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
      relations: ['client_supply', 'technical_document'],
    });

    return Promise.all(
      evaluations.map(async (e) => this.toResponseDto(e)),
    );
  }

  async findOne(id: number): Promise<DocumentEvaluationResponseDto> {
    const evaluation = await this.documentEvaluationRepository.findOne({ 
      where: { id }, relations: ['client_supply', 'technical_document'] });
    if (!evaluation) throw new NotFoundException('Document Evaluation not found');
    
    return this.toResponseDto(evaluation);
  }

  private async toResponseDto(entity: DocumentEvaluationEntity): Promise<DocumentEvaluationResponseDto> {
    return toDto(DocumentEvaluationResponseDto, entity);
  }

  async update(id: number, dto: UpdateDocumentEvaluationDto) {
    const evaluation = await this.documentEvaluationRepository.findOne({
      where: { id },
      relations: ['client_supply', 'technical_document'],
    });

    if (!evaluation) {
      throw new NotFoundException('Document Evaluation not found');
    }

    if (dto.client_supply_id) {
      const client_supply = await this.clientSupplyRepository.findOne({ where: { id: dto.client_supply_id } });
      if (!client_supply) throw new NotFoundException('Client Supply not found');
      evaluation.client_supply = client_supply;
    }

    if (dto.technical_document_id) {
      const technical_document = await this.technicalDocumentRepository.findOne({ where: { id: dto.technical_document_id } });
      if (!technical_document) throw new NotFoundException('Technical Document not found');
      evaluation.technical_document = technical_document;
    }

    if (dto.evaluation_date !== undefined) {
      evaluation.evaluation_date = dto.evaluation_date;
    }

    if (dto.is_approved !== undefined) {
      evaluation.is_approved = dto.is_approved;
    }

    if (dto.send_date !== undefined) {
      evaluation.send_date = dto.send_date;
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
