import { Module } from '@nestjs/common';
import { IndustrialEvaluationService } from './industrial_evaluation.service';
import { IndustrialEvaluationController } from './industrial_evaluation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndustrialEvaluationEntity } from './industrial_evaluation.entity';
import { IndustrialPurchaseEntity } from '../industrial_purchase/industrial_purchase.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IndustrialEvaluationEntity, IndustrialPurchaseEntity])],
  providers: [IndustrialEvaluationService],
  controllers: [IndustrialEvaluationController],
})
export class IndustrialEvaluationModule {}
