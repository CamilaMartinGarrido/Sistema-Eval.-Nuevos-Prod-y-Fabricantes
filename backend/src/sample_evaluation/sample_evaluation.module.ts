import { Module } from '@nestjs/common';
import { SampleEvaluationService } from './sample_evaluation.service';
import { SampleEvaluationController } from './sample_evaluation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SampleEvaluationEntity } from './sample_evaluation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SampleEvaluationEntity])],
  providers: [SampleEvaluationService],
  controllers: [SampleEvaluationController],
})
export class SampleEvaluationModule {}
