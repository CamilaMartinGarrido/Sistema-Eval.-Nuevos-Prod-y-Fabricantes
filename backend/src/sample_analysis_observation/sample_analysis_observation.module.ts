import { Module } from '@nestjs/common';
import { SampleAnalysisObservationService } from './sample_analysis_observation.service';
import { SampleAnalysisObservationController } from './sample_analysis_observation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SampleAnalysisObservationEntity } from './sample_analysis_observation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SampleAnalysisObservationEntity])],
  providers: [SampleAnalysisObservationService],
  controllers: [SampleAnalysisObservationController],
})
export class SampleAnalysisObservationModule {}
