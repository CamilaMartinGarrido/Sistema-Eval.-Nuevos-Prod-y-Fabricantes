import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentEvaluationObservationService } from './document_evaluation_observation.service';
import { DocumentEvaluationObservationController } from './document_evaluation_observation.controller';
import { DocumentEvaluationObservationEntity } from './document_evaluation_observation.entity';
import { DocumentEvaluationEntity } from '../document_evaluation/document_evaluation.entity';
import { ObservationEntity } from '../observation/observation.entity';
import { ObservationModule } from '../observation/observation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DocumentEvaluationObservationEntity,
      DocumentEvaluationEntity,
      ObservationEntity]
    ),
    ObservationModule,
  ],
  providers: [DocumentEvaluationObservationService],
  controllers: [DocumentEvaluationObservationController],
})
export class DocumentEvaluationObservationModule {}
