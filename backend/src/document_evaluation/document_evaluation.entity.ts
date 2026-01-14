import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne, JoinColumn, Index, OneToMany } from 'typeorm';
import { EvaluationProcessEntity } from '../evaluation_process/evaluation_process.entity';
import { TechnicalDocumentEntity } from '../technical_document/technical_document.entity';
import { DocumentEvaluationObservationEntity } from '../document_evaluation_observation/document_evaluation_observation.entity';

@Unique('uq_document_evaluation', ['evaluation_process', 'technical_document'])
@Index('idx_doc_eval_process', ['evaluation_process'])
@Index('idx_doc_eval_tech_doc', ['technical_document'])
@Index('idx_doc_eval_approve', ['is_approved'], { where: `"is_approved" = true` })
@Index('idx_doc_eval_send_date', ['send_date'])
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

  @Column({ type: 'date', nullable: false })
  send_date: string;

  @Column({ type: 'date', nullable: true })
  evaluation_date: string;

  @Column({ type: 'boolean', nullable: true })
  is_approved: boolean;

  @OneToMany(() => DocumentEvaluationObservationEntity, (doc_eval_observ) => doc_eval_observ.document_evaluation)
  document_evaluation_observs: DocumentEvaluationObservationEntity[];
}
