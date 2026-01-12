import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { ResultIndustrialAnalysisEnum } from '../enums';
import { IndustrialPurchaseEntity } from 'src/industrial_purchase/industrial_purchase.entity';
import { IndustrialEvaluationObservationEntity } from 'src/industrial_evaluation_observation/industrial_evaluation_observation.entity';

@Unique(['industrial_purchase'])
@Index('idx_ind_eval_purchase', ['industrial_purchase'])
@Index('idx_ind_eval_send_date', ['send_batch_date'])
@Index('idx_ind_eval_report_date', ['report_delivery_date'])
@Entity({ name: 'industrial_evaluation' })
export class IndustrialEvaluationEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => IndustrialPurchaseEntity, (purchase) => purchase.industrial_evaluations, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'industrial_purchase_id' })
  industrial_purchase: IndustrialPurchaseEntity;

  @Column({ type: 'date' })
  send_batch_date: string;

  @Column({ type: 'date', nullable: true })
  reception_batch_date: string;

  @Column({
    type: 'enum',
    enum: ResultIndustrialAnalysisEnum,
    enumName: 'result_industrial_analysis_enum',
    nullable: true,
  })
  analysis_result: ResultIndustrialAnalysisEnum;

  @Column({ type: 'date', nullable: true })
  report_delivery_date: string;

  @OneToMany(() => IndustrialEvaluationObservationEntity, (industrial_evaluation_observ) => industrial_evaluation_observ.industrial_evaluation)
  industrial_evaluation_observs: IndustrialEvaluationObservationEntity[];
}
