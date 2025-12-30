import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SampleEvaluationService } from './sample_evaluation.service';
import { SampleEvaluationController } from './sample_evaluation.controller';
import { SampleEvaluationEntity } from './sample_evaluation.entity';
import { ClientSupplyEntity } from '../client_supply/client_supply.entity';
import { SampleEntity } from '../sample/sample.entity';
import { SampleAnalysisEntity } from '../sample_analysis/sample_analysis.entity';
import { ClientEntity } from '../client/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SampleEvaluationEntity, ClientSupplyEntity, SampleAnalysisEntity, ClientEntity])],
  providers: [SampleEvaluationService],
  controllers: [SampleEvaluationController],
})
export class SampleEvaluationModule {}
