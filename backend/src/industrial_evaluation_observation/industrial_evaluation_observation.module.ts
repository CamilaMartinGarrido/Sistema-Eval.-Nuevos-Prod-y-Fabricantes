import { Module } from '@nestjs/common';
import { IndustrialEvaluationObservationService } from './industrial_evaluation_observation.service';
import { IndustrialEvaluationObservationController } from './industrial_evaluation_observation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndustrialEvaluationObservationEntity } from './industrial_evaluation_observation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IndustrialEvaluationObservationEntity])],
  providers: [IndustrialEvaluationObservationService],
  controllers: [IndustrialEvaluationObservationController],
})
export class IndustrialEvaluationObservationModule {}
