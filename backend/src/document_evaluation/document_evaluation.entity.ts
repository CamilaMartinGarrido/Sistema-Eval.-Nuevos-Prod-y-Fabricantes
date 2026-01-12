import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne, JoinColumn, Index } from 'typeorm';
import { EvaluationProcessEntity } from '../evaluation_process/evaluation_process.entity';
import { TechnicalDocumentEntity } from '../technical_document/technical_document.entity';

@Unique(['evaluation_process', 'technical_document'])
@Index('idx_doc_eval_process', ['evaluation_process'])
@Index('idx_doc_eval_tech_doc', ['technical_document'])
@Index('idx_doc_eval_approve', ['is_approved'], {
  where: `"is_approved" = true`
})
@Entity({ name: 'document_evaluation' })
export class DocumentEvaluationEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => EvaluationProcessEntity, (evaluation) => evaluation.document_evals, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'evaluation_process_id' })
  evaluation_process: EvaluationProcessEntity;

  @ManyToOne(() => TechnicalDocumentEntity, (td) => td.document_evals, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'technical_document_id' })
  technical_document: TechnicalDocumentEntity;

  @Column({ type: 'date' })
  send_date: string;

  @Column({ type: 'date', nullable: true })
  evaluation_date: string;

  @Column({ type: 'boolean', nullable: true })
  is_approved: boolean;
}
