import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SampleEvaluationObservationService } from './sample_evaluation_observation.service';
import { SampleEvaluationObservationController } from './sample_evaluation_observation.controller';
import { SampleEvaluationObservationEntity } from './sample_evaluation_observation.entity';
import { SampleEvaluationEntity } from '../sample_evaluation/sample_evaluation.entity';
import { ObservationEntity } from '../observation/observation.entity';
import { ObservationModule } from '../observation/observation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SampleEvaluationObservationEntity,
      SampleEvaluationEntity,
      ObservationEntity]
    ),
    ObservationModule,
  ],
  providers: [SampleEvaluationObservationService],
  controllers: [SampleEvaluationObservationController],
})
export class SampleEvaluationObservationModule {}
