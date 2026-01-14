import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { SampleEntity } from '../sample/sample.entity';
import { ClientEntity } from '../client/client.entity';
import { SampleAnalysisObservationEntity } from '../sample_analysis_observation/sample_analysis_observation.entity';
import { SampleEvaluationEntity } from '../sample_evaluation/sample_evaluation.entity';

@Unique('uq_sample_analysis', ['sample', 'performed_by_client', 'analysis_date'])
@Index('idx_sample_analysis_sample', ['sample'])
@Index('idx_sample_analysis_client', ['performed_by_client'])
@Index('idx_sample_analysis_date', ['analysis_date'])
@Entity({ name: 'sample_analysis' })
export class SampleAnalysisEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => SampleEntity, (sample) => sample.sample_analyses, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sample_id' })
  sample: SampleEntity;

  @ManyToOne(() => ClientEntity, (client) => client.sample_analyses, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'performed_by_client' })
  performed_by_client: ClientEntity;

  @Column({ type: 'date', nullable: true })
  analysis_date: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  analysis_name: string;

  @Column({ type: 'text', nullable: true })
  analysis_result_details: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  raw_data_path: string;

  @OneToMany(() => SampleAnalysisObservationEntity, (sample_analysis_observ) => sample_analysis_observ.sample_analysis)
  sample_analysis_observs: SampleAnalysisObservationEntity[];

  @OneToMany(() => SampleEvaluationEntity, evaluation => evaluation.sample_analysis)
  sample_evaluations: SampleEvaluationEntity[];
}
