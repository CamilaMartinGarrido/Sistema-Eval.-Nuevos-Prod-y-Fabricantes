import { Module } from '@nestjs/common';
import { IndustrialEvaluationService } from './industrial_evaluation.service';
import { IndustrialEvaluationController } from './industrial_evaluation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndustrialEvaluationEntity } from './industrial_evaluation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IndustrialEvaluationEntity])],
  providers: [IndustrialEvaluationService],
  controllers: [IndustrialEvaluationController],
})
export class IndustrialEvaluationModule {}
