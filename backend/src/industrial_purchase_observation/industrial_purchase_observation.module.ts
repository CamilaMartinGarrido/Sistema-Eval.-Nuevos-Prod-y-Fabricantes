import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndustrialPurchaseObservationService } from './industrial_purchase_observation.service';
import { IndustrialPurchaseObservationController } from './industrial_purchase_observation.controller';
import { IndustrialPurchaseObservationEntity } from './industrial_purchase_observation.entity';
import { IndustrialPurchaseEntity } from '../industrial_purchase/industrial_purchase.entity';
import { ObservationEntity } from '../observation/observation.entity';
import { ObservationModule } from '../observation/observation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IndustrialPurchaseObservationEntity,
      IndustrialPurchaseEntity,
      ObservationEntity]
    ),
    ObservationModule
  ],
  providers: [IndustrialPurchaseObservationService],
  controllers: [IndustrialPurchaseObservationController],
})
export class IndustrialPurchaseObservationModule {}
