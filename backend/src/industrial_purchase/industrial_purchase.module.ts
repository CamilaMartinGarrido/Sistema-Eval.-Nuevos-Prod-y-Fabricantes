import { Module } from '@nestjs/common';
import { IndustrialPurchaseService } from './industrial_purchase.service';
import { IndustrialPurchaseController } from './industrial_purchase.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndustrialPurchaseEntity } from './industrial_purchase.entity';
import { ClientSupplyEntity } from '../client_supply/client_supply.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IndustrialPurchaseEntity, ClientSupplyEntity])],
  providers: [IndustrialPurchaseService],
  controllers: [IndustrialPurchaseController],
})
export class IndustrialPurchaseModule {}
