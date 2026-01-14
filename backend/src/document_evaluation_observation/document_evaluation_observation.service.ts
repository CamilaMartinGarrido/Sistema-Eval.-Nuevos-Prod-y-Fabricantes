import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentEvaluationObservationEntity } from './document_evaluation_observation.entity';
import { DocumentEvaluationEntity } from 'src/document_evaluation/document_evaluation.entity';
import { ObservationService } from '../observation/observation.service';
import { CreateDocumentEvaluationObservationDto, DocumentEvaluationObservationResponseDto, UpdateDocumentEvaluationObservationDto } from './dtos';
import { toDto } from 'src/common/utils/mapper.util';

@Injectable()
export class DocumentEvaluationObservationService {
  constructor(
    @InjectRepository(DocumentEvaluationObservationEntity)
    private readonly docEvalObservationRepository: Repository<DocumentEvaluationObservationEntity>,

    @InjectRepository(DocumentEvaluationEntity)
    private readonly docEvalRepository: Repository<DocumentEvaluationEntity>,
    
    @Inject(forwardRef(() => ObservationService))
    private readonly observationService: ObservationService,
  ) {}

  async create(dto: CreateDocumentEvaluationObservationDto): Promise<{ message: string; data: DocumentEvaluationObservationEntity }> {
    const document_evaluation = await this.docEvalRepository.findOne({
      where: { id: dto.document_evaluation_id },
    });

    if (!document_evaluation) {
      throw new NotFoundException('Document Evaluation not found');
    }

    let observation;

    if (dto.observation_id) {
      observation = await this.observationService.findOneEntity(dto.observation_id);

    } else if (dto.observation) {
      observation = await this.observationService.createOrGet(dto.observation);

    } else {
      throw new BadRequestException('Observation data is required');
    }

    const link = this.docEvalObservationRepository.create({
      document_evaluation,
      observation,
    });

    const created = await this.docEvalObservationRepository.save(link);

    return {
      message: 'Document Evaluation Observation created successfully',
      data: created,
    };
  }

  async findAll(limit = 100, offset = 0): Promise<DocumentEvaluationObservationResponseDto[]> {
    const items = await this.docEvalObservationRepository.find({
      take: limit,
      skip: offset,
      relations: ['document_evaluation', 'observation'],
    });

    return Promise.all(items.map((i) => this.toResponseDto(i)));
  }

  async findOne(id: number): Promise<DocumentEvaluationObservationResponseDto> {
    const item = await this.docEvalObservationRepository.findOne({
      where: { id },
      relations: ['document_evaluation', 'observation'],
    });

    if (!item) throw new NotFoundException('Document Evaluation Observation not found');

    return this.toResponseDto(item);
  }

  private async toResponseDto(entity: DocumentEvaluationObservationEntity) {
    return toDto(DocumentEvaluationObservationResponseDto, entity);
  }

  async update(id: number, dto: UpdateDocumentEvaluationObservationDto) {
    const link = await this.docEvalObservationRepository.findOne({
      where: { id },
      relations: ['document_evaluation', 'observation'],
    });

    if (!link) {
      throw new NotFoundException('Document Evaluation Observation not found');
    }

    if (dto.document_evaluation_id) {
      const doc_eval = await this.docEvalRepository.findOne({
        where: { id: dto.document_evaluation_id },
      });

      if (!doc_eval) throw new NotFoundException('Document Evaluation not found');

      link.document_evaluation = doc_eval;
    }

    if (dto.observation_id) {
      const obs = await this.observationService.findOneEntity(dto.observation_id);
      link.observation = obs;
    }

    if (dto.observation) {
      const updatedObs = await this.observationService.createOrGet(dto.observation);
      link.observation = updatedObs;
    }

    await this.docEvalObservationRepository.save(link);

    return { message: 'Document Evaluation Observation updated successfully' };
  }

  async remove(id: number) {
    const link = await this.docEvalObservationRepository.findOne({
      where: { id },
    });

    if (!link) {
      throw new NotFoundException('Document Evaluation Observation not found');
    }

    await this.docEvalObservationRepository.remove(link);

    return { message: 'Document Evaluation Observation deleted successfully' };
  }
}
