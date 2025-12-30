import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SampleAnalysisService } from './sample_analysis.service';
import { SampleAnalysisController } from './sample_analysis.controller';
import { SampleAnalysisEntity } from './sample_analysis.entity';
import { SampleEntity } from '../sample/sample.entity';
import { ClientEntity } from '../client/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SampleAnalysisEntity, SampleEntity, ClientEntity])],
  providers: [SampleAnalysisService],
  controllers: [SampleAnalysisController],
})
export class SampleAnalysisModule {}
