import { Module } from '@nestjs/common';
import { DocumentEvaluationService } from './document_evaluation.service';
import { DocumentEvaluationController } from './document_evaluation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentEvaluationEntity } from './document_evaluation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentEvaluationEntity])],
  providers: [DocumentEvaluationService],
  controllers: [DocumentEvaluationController],
})
export class DocumentEvaluationModule {}
