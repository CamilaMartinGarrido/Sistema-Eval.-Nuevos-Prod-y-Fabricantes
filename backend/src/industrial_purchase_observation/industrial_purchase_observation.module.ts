import { Module } from '@nestjs/common';
import { IndustrialPurchaseObservationService } from './industrial_purchase_observation.service';
import { IndustrialPurchaseObservationController } from './industrial_purchase_observation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndustrialPurchaseObservationEntity } from './industrial_purchase_observation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IndustrialPurchaseObservationEntity])],
  providers: [IndustrialPurchaseObservationService],
  controllers: [IndustrialPurchaseObservationController],
})
export class IndustrialPurchaseObservationModule {}
