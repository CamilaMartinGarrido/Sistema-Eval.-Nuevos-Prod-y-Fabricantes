import { Module } from '@nestjs/common';
import { SampleAnalysisService } from './sample_analysis.service';
import { SampleAnalysisController } from './sample_analysis.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SampleAnalysisEntity } from './sample_analysis.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SampleAnalysisEntity])],
  providers: [SampleAnalysisService],
  controllers: [SampleAnalysisController],
})
export class SampleAnalysisModule {}
