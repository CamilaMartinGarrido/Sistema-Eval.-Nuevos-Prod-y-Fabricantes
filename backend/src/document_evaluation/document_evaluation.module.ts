import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentEvaluationService } from './document_evaluation.service';
import { DocumentEvaluationController } from './document_evaluation.controller';
import { DocumentEvaluationEntity } from './document_evaluation.entity';
import { ClientSupplyEntity } from '../client_supply/client_supply.entity';
import { TechnicalDocumentEntity } from '../technical_document/technical_document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentEvaluationEntity, ClientSupplyEntity, TechnicalDocumentEntity])],
  providers: [DocumentEvaluationService],
  controllers: [DocumentEvaluationController],
})
export class DocumentEvaluationModule {}
