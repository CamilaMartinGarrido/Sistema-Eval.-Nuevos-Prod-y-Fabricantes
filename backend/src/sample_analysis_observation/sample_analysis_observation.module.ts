import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SampleAnalysisObservationService } from './sample_analysis_observation.service';
import { SampleAnalysisObservationController } from './sample_analysis_observation.controller';
import { SampleAnalysisObservationEntity } from './sample_analysis_observation.entity';
import { SampleAnalysisEntity } from '../sample_analysis/sample_analysis.entity';
import { ObservationEntity } from '../observation/observation.entity';
import { ObservationModule } from '../observation/observation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SampleAnalysisObservationEntity,
      SampleAnalysisEntity,
      ObservationEntity]
    ),
    ObservationModule,
  ],
  providers: [SampleAnalysisObservationService],
  controllers: [SampleAnalysisObservationController],
})
export class SampleAnalysisObservationModule {}
