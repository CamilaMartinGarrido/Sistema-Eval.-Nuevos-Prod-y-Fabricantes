import { Module } from '@nestjs/common';
import { ExploratoryOfferService } from './exploratory_offer.service';
import { ExploratoryOfferController } from './exploratory_offer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExploratoryOfferEntity } from './exploratory_offer.entity';
import { SupplyEntity } from '../supply/supply.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExploratoryOfferEntity, SupplyEntity])],
  providers: [ExploratoryOfferService],
  controllers: [ExploratoryOfferController],
})
export class ExploratoryOfferModule {}
