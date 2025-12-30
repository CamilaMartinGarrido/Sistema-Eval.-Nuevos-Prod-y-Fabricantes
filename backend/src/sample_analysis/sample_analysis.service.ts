import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SampleAnalysisEntity } from './sample_analysis.entity';
import { SampleEntity } from '../sample/sample.entity';
import { ClientEntity } from '../client/client.entity';
import { CreateSampleAnalysisDto, SampleAnalysisResponseDto, UpdateSampleAnalysisDto } from './dtos';
import { toDto } from 'src/common/utils/mapper.util';

@Injectable()
export class SampleAnalysisService {
  constructor(
    @InjectRepository(SampleAnalysisEntity)
    private readonly sampleAnalysisRepository: Repository<SampleAnalysisEntity>,

    @InjectRepository(SampleEntity)
    private readonly sampleRepository: Repository<SampleEntity>,

    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
  ) {}

  async create(dto: CreateSampleAnalysisDto): Promise<{ message: string; data: SampleAnalysisEntity }> {
    const sample = await this.sampleRepository.findOne({ where: { id: dto.sample_id } });
    if (!sample) throw new NotFoundException('Sample not found');

    const performed_by_client = await this.clientRepository.findOne({ where: { id: dto.performed_by_client } });
    if (!performed_by_client) throw new NotFoundException('Client not found');

    const analysis = this.sampleAnalysisRepository.create({
      sample,
      performed_by_client,
      analysis_date: dto.analysis_date,
      result: dto.result
    });

    const created = await this.sampleAnalysisRepository.save(analysis);
    
    return { 
      message: 'Sample Analysis created successfully',
      data: created,
    }
  }

  async findAll(limit = 100, offset = 0): Promise<SampleAnalysisResponseDto[]> {
    const analyses = await this.sampleAnalysisRepository.find({
      take: limit,
      skip: offset,
      relations: [
        'sample',
        'performed_by_client',
        'sample_analysis_observs',
        'sample_analysis_observs.observation',
      ],
    });

    return Promise.all(
      analyses.map((a) => this.toResponseDto(a)),
    );
  }

  async findOne(id: number): Promise<SampleAnalysisResponseDto> {
    const analysis = await this.sampleAnalysisRepository.findOne({
      where: { id },
      relations: [
        'sample',
        'performed_by_client',
        'sample_analysis_observs',
        'sample_analysis_observs.observation',
      ],
    });

    if (!analysis) throw new NotFoundException('Sample Analysis not found');

    return this.toResponseDto(analysis);
  }

  private async toResponseDto(entity: SampleAnalysisEntity): Promise<SampleAnalysisResponseDto> {
    return toDto(SampleAnalysisResponseDto, entity);
  }

  async update(id: number, dto: UpdateSampleAnalysisDto) {
    const analysis = await this.sampleAnalysisRepository.findOne({
      where: { id },
      relations: ['sample', 'performed_by_client'],
    });

    if (!analysis) {
      throw new NotFoundException('Sample Analysis not found');
    }

    if (dto.sample_id) {
      const sample = await this.sampleRepository.findOne({ where: { id: dto.sample_id } });
      if (!sample) throw new NotFoundException('Sample not found');
      analysis.sample = sample;
    }

    if (dto.performed_by_client) {
      const performed_by_client = await this.clientRepository.findOne({ where: { id: dto.performed_by_client } });
      if (!performed_by_client) throw new NotFoundException('Client not found');
      analysis.performed_by_client = performed_by_client;
    }

    if (dto.analysis_date !== undefined) {
      analysis.analysis_date = dto.analysis_date;
    }

    if (dto. result !== undefined) {
      analysis.result = dto.result;
    }

    await this.sampleAnalysisRepository.save(analysis);

    return { message: 'Sample Analysis updated successfully' };
  }

  async remove(id: number): Promise<{ message: string }> {
    const analysis = await this.sampleAnalysisRepository.findOne({
      where: { id },
    });

    if (!analysis) {
      throw new NotFoundException('Sample Analysis not found');
    }

    await this.sampleAnalysisRepository.remove(analysis);

    return { message: 'Sample Analysis deleted successfully' };
  }
}
