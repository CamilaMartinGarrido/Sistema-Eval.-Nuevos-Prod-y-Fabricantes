import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { EvaluationProcessEntity } from '../evaluation_process/evaluation_process.entity';
import { SampleAnalysisEntity } from '../sample_analysis/sample_analysis.entity';
import { ResultSampleEvaluationEnum } from 'src/enums';
import { SampleEvaluationObservationEntity } from '../sample_evaluation_observation/sample_evaluation_observation.entity';

@Unique('uq_sample_evaluation', ['evaluation_process', 'sample_analysis'])
@Index('idx_sample_eval_process', ['evaluation_process'])
@Index('idx_sample_eval_analysis', ['sample_analysis'])
@Index('idx_sample_eval_conform', ['result'], { where: `"result" = Conforme` })
@Index('idx_sample_eval_continue', ['decision_continue'], {
  where: `"decision_continue" = true`
})
@Entity({ name: 'sample_evaluation' })
export class SampleEvaluationEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => EvaluationProcessEntity, (evaluation) => evaluation.sample_evaluations, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'evaluation_process_id' })
  evaluation_process: EvaluationProcessEntity;

  @ManyToOne(() => SampleAnalysisEntity, (sample_analysis) => sample_analysis.sample_evaluations, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'sample_analysis_id' })
  sample_analysis: SampleAnalysisEntity;

  @Column({ type: 'boolean', nullable: false })
  self_performed: boolean;

  @Column({ type: 'date', nullable: true })
  send_analysis_date: string;

  @Column({ type: 'date', nullable: true })
  evaluation_date: string;

  @Column({
    type: 'enum',
    enum: ResultSampleEvaluationEnum,
    enumName: 'result_sample_evaluation_enum',
    nullable: true,
  })
  result: ResultSampleEvaluationEnum;

  @Column({ type: 'boolean', nullable: true })
  decision_continue: boolean;

  @OneToMany(() => SampleEvaluationObservationEntity, (sample_evaluation_observ) => sample_evaluation_observ.sample_evaluation)
  sample_evaluation_observs: SampleEvaluationObservationEntity[];
}
