import { Module } from '@nestjs/common';
import { RequestOfferService } from './request_offer.service';
import { RequestOfferController } from './request_offer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestOfferEntity } from './request_offer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RequestOfferEntity])],
  providers: [RequestOfferService],
  controllers: [RequestOfferController],
})
export class RequestOfferModule {}
