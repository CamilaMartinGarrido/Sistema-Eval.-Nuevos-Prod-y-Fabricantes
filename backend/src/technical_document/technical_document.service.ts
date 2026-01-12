import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TechnicalDocumentEntity } from './technical_document.entity';
import { CreateTechnicalDocumentDto, TechnicalDocumentResponseDto, UpdateTechnicalDocumentDto } from './dtos';
import { SupplyEntity } from '../supply/supply.entity';
import { toDto } from 'src/common/utils/mapper.util';

@Injectable()
export class TechnicalDocumentService {
  constructor(
    @InjectRepository(TechnicalDocumentEntity)
    private readonly technicalDocumentRepository: Repository<TechnicalDocumentEntity>,

    @InjectRepository(SupplyEntity)
    private readonly supplyRepository: Repository<SupplyEntity>,
  ) {}

  async create(dto: CreateTechnicalDocumentDto): Promise<{ message: string; data: TechnicalDocumentEntity }> {
    const supply = await this.supplyRepository.findOne({ where: { id: dto.supply_id } });
    if (!supply) throw new NotFoundException('Supply not found');

    const document = this.technicalDocumentRepository.create({
      supply,
      document_name: dto.document_name,
      document_type: dto.document_type,
      version: dto.version,
      file_path: dto.file_path,
      request_date: dto.request_date,
      receipt_date: dto.receipt_date,
    });

    const created = await this.technicalDocumentRepository.save(document);
    
    return { 
      message: 'Technical Document created successfully',
      data: created,
    }
  }

  async findAll(limit = 100, offset = 0): Promise<TechnicalDocumentResponseDto[]> {
    const documents = await this.technicalDocumentRepository.find({
      take: limit,
      skip: offset,
      relations: ['supply'],
    });

    return Promise.all(
      documents.map(async (d) => this.toResponseDto(d)),
    );
  }

  async findOne(id: number): Promise<TechnicalDocumentResponseDto> {
    const document = await this.technicalDocumentRepository.findOne({ where: { id }, relations: ['supply'] });
    if (!document) throw new NotFoundException('Technical Document not found');
    
    return this.toResponseDto(document);
  }

  private async toResponseDto(entity: TechnicalDocumentEntity): Promise<TechnicalDocumentResponseDto> {
    return toDto(TechnicalDocumentResponseDto, entity);
  }

  async update(id: number, dto: UpdateTechnicalDocumentDto) {
    // Cargar los documentos con sus relaciones
    const document = await this.technicalDocumentRepository.findOne({
      where: { id },
      relations: ['supply'],
    });

    if (!document) {
      throw new NotFoundException('Technical Document not found');
    }

    if (dto.supply_id) {
      const supply = await this.supplyRepository.findOne({ where: { id: dto.supply_id } });
      if (!supply) throw new NotFoundException('Supply not found');
      document.supply = supply;
    }

    if (dto.document_name !== undefined) {
      document.document_name = dto.document_name;
    }

    if (dto.document_type !== undefined) {
      document.document_type = dto.document_type;
    }

    if (dto.version !== undefined) {
      document.version = dto.version;
    }

    if (dto.file_path !== undefined) {
      document.file_path = dto.file_path;
    }

    if (dto.request_date !== undefined) {
      document.request_date = dto.request_date;
    }

    if (dto.receipt_date !== undefined) {
      document.receipt_date = dto.receipt_date;
    }

    const updated = await this.technicalDocumentRepository.save(document);

    return { message: 'Technical Document updated successfully' };
  }

  async remove(id: number): Promise<{ message: string }> {
    const document = await this.technicalDocumentRepository.findOne({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException('Technical Document not found');
    }

    await this.technicalDocumentRepository.remove(document);

    return { message: 'Technical Document deleted successfully' };
  }
}
