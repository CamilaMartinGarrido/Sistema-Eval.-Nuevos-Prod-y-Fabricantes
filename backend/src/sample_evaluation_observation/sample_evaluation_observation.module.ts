import { Module } from '@nestjs/common';
import { SampleEvaluationObservationService } from './sample_evaluation_observation.service';
import { SampleEvaluationObservationController } from './sample_evaluation_observation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SampleEvaluationObservationEntity } from './sample_evaluation_observation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SampleEvaluationObservationEntity])],
  providers: [SampleEvaluationObservationService],
  controllers: [SampleEvaluationObservationController],
})
export class SampleEvaluationObservationModule {}
