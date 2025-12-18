import { Module } from '@nestjs/common';
import { IndustrialPurchaseService } from './industrial_purchase.service';
import { IndustrialPurchaseController } from './industrial_purchase.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndustrialPurchaseEntity } from './industrial_purchase.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IndustrialPurchaseEntity])],
  providers: [IndustrialPurchaseService],
  controllers: [IndustrialPurchaseController],
})
export class IndustrialPurchaseModule {}
