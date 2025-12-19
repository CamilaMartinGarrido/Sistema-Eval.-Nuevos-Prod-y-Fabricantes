import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestOfferEntity } from './request_offer.entity';
import { ApplicationEntity } from '../application/application.entity';
import { ExploratoryOfferEntity } from '../exploratory_offer/exploratory_offer.entity';
import { CreateRequestOfferDto, RequestOfferResponseDto, UpdateRequestOfferDto } from './dtos';
import { toDto } from 'src/common/utils/mapper.util';

@Injectable()
export class RequestOfferService {
  constructor(
    @InjectRepository(RequestOfferEntity)
    private readonly requestOfferRepository: Repository<RequestOfferEntity>,

    @InjectRepository(ApplicationEntity)
    private readonly appRepository: Repository<ApplicationEntity>,

    @InjectRepository(ExploratoryOfferEntity)
    private readonly offerRepository: Repository<ExploratoryOfferEntity>,
  ) {}
  
  async create(dto: CreateRequestOfferDto): Promise<{ message: string; data: RequestOfferEntity }> {
    const application = await this.appRepository.findOne({ where: { id: dto.application_id } });
    if (!application) throw new NotFoundException('Application not found');
  
    const exploratory_offer = await this.offerRepository.findOne({ where: { id: dto.exploratory_offer_id } });
    if (!exploratory_offer) throw new NotFoundException('Exploratory Offer not found');
  
    const request_offer = this.requestOfferRepository.create({
      application,
      exploratory_offer,
    });
  
    const saved = await this.requestOfferRepository.save(request_offer);
  
    return {
      message: 'Request Offer created successfully',
      data: saved,
    };
  }

  async findAll(limit = 100, offset = 0): Promise<RequestOfferResponseDto[]> {
    const requestOffers = await this.requestOfferRepository.find({
      take: limit,
      skip: offset,
      relations: ['application', 'exploratory_offer'],
    });
  
    return Promise.all(
      requestOffers.map(async (ro) => this.toResponseDto(ro)),
    );
  }
  
  async findOne(id: number): Promise<RequestOfferResponseDto> {
    const ro = await this.requestOfferRepository.findOne({ where: { id }, relations: ['application', 'exploratory_offer'] });
    if (!ro) throw new NotFoundException('Request Offer not found');
      
    return this.toResponseDto(ro);
  }
  
  private async toResponseDto(entity: RequestOfferEntity): Promise<RequestOfferResponseDto> {
    return toDto(RequestOfferResponseDto, entity);
  }

  async update(id: number, dto: UpdateRequestOfferDto): Promise<{ message: string }> {
    const ro = await this.requestOfferRepository.findOne({
      where: { id },
      relations: ['application', 'exploratory_offer'],
    });
  
    if (!ro) throw new NotFoundException('Request Offer not found');
  
    // Cambiar application si viene application_id (no actualizar sus datos)
    if (dto.application_id) {
      const application = await this.appRepository.findOne({ where: { id: dto.application_id } });
      if (!application) throw new NotFoundException('Application not found');
      ro.application = application;
    }

    // Cambiar exploratory_offer si viene exploratory_offer_id (no actualizar sus datos)
    if (dto.exploratory_offer_id) {
      const offer = await this.offerRepository.findOne({ where: { id: dto.exploratory_offer_id } });
      if (!offer) throw new NotFoundException('Exploratory Offer not found');
      ro.exploratory_offer = offer;
    }

    await this.requestOfferRepository.save(ro);
  
    return { message: 'Request Offer updated successfully' };
  }
  
  async remove(id: number): Promise<{ message: string }> {
    const ro = await this.requestOfferRepository.findOne({
      where: { id },
      relations: ['application', 'exploratory_offer'],
    });
  
    if (!ro) throw new NotFoundException('Request Offer not found');

    await this.requestOfferRepository.remove(ro);

    return { message: 'Request Offer deleted successfully' };
  }
}
