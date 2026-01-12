import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentEvaluationService } from './document_evaluation.service';
import { DocumentEvaluationController } from './document_evaluation.controller';
import { DocumentEvaluationEntity } from './document_evaluation.entity';
import { EvaluationProcessEntity } from '../evaluation_process/evaluation_process.entity';
import { TechnicalDocumentEntity } from '../technical_document/technical_document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentEvaluationEntity, EvaluationProcessEntity, TechnicalDocumentEntity])],
  providers: [DocumentEvaluationService],
  controllers: [DocumentEvaluationController],
})
export class DocumentEvaluationModule {}
