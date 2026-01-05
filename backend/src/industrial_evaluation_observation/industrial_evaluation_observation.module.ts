import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndustrialEvaluationObservationService } from './industrial_evaluation_observation.service';
import { IndustrialEvaluationObservationController } from './industrial_evaluation_observation.controller';
import { IndustrialEvaluationObservationEntity } from './industrial_evaluation_observation.entity';
import { IndustrialEvaluationEntity } from '../industrial_evaluation/industrial_evaluation.entity';
import { ObservationEntity } from '../observation/observation.entity';
import { ObservationModule } from '../observation/observation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IndustrialEvaluationObservationEntity, 
      IndustrialEvaluationEntity,
      ObservationEntity]
    ),
      ObservationModule
  ],
  providers: [IndustrialEvaluationObservationService],
  controllers: [IndustrialEvaluationObservationController],
})
export class IndustrialEvaluationObservationModule {}
