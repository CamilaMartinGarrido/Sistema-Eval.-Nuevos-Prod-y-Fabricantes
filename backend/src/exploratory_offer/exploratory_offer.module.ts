import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExploratoryOfferService } from './exploratory_offer.service';
import { ExploratoryOfferController } from './exploratory_offer.controller';
import { ExploratoryOfferEntity } from './exploratory_offer.entity';
import { SupplyEntity } from '../supply/supply.entity';
import { SupplierPurchaseEntity } from '../supplier_purchase/supplier_purchase.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExploratoryOfferEntity, SupplyEntity, SupplierPurchaseEntity])],
  providers: [ExploratoryOfferService],
  controllers: [ExploratoryOfferController],
})
export class ExploratoryOfferModule {}
