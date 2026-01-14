import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique, Index } from 'typeorm';
import { DocumentEvaluationEntity } from '../document_evaluation/document_evaluation.entity';
import { ObservationEntity } from '../observation/observation.entity';

@Unique('uq_de_obs', ['document_evaluation', 'observation'])
@Index('idx_de_obs_doc_eval', ['document_evaluation'])
@Index('idx_de_obs_observation', ['observation'])
@Entity({ name: 'document_evaluation_observation' })
export class DocumentEvaluationObservationEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => DocumentEvaluationEntity, (doc_eval) => doc_eval.document_evaluation_observs, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'document_evaluation_id' })
  document_evaluation: DocumentEvaluationEntity;
    
  @ManyToOne(() => ObservationEntity, (observation) => observation.document_evaluation_observs, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'observation_id' })
  observation: ObservationEntity;
}
