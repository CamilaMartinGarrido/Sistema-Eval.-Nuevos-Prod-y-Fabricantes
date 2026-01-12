import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SampleEvaluationService } from './sample_evaluation.service';
import { SampleEvaluationController } from './sample_evaluation.controller';
import { SampleEvaluationEntity } from './sample_evaluation.entity';
import { EvaluationProcessEntity } from '../evaluation_process/evaluation_process.entity';
import { SampleAnalysisEntity } from '../sample_analysis/sample_analysis.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SampleEvaluationEntity, EvaluationProcessEntity, SampleAnalysisEntity])],
  providers: [SampleEvaluationService],
  controllers: [SampleEvaluationController],
})
export class SampleEvaluationModule {}
