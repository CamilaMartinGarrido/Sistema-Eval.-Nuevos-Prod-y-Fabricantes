import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestOfferService } from './request_offer.service';
import { RequestOfferController } from './request_offer.controller';
import { RequestOfferEntity } from './request_offer.entity';
import { ApplicationEntity } from '../application/application.entity';
import { ExploratoryOfferEntity } from '../exploratory_offer/exploratory_offer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RequestOfferEntity, ApplicationEntity, ExploratoryOfferEntity])],
  providers: [RequestOfferService],
  controllers: [RequestOfferController],
})
export class RequestOfferModule {}
