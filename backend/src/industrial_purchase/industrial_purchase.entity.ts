import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { StateIndustrialPurchasingEnum } from '../enums';
import { EvaluationProcessEntity } from '../evaluation_process/evaluation_process.entity';
import { IndustrialPurchaseObservationEntity } from '../industrial_purchase_observation/industrial_purchase_observation.entity';
import { IndustrialEvaluationEntity } from '../industrial_evaluation/industrial_evaluation.entity';

@Unique(['evaluation_process'])
@Index('idx_ind_purchase_process', ['evaluation_process'])
@Entity({ name: 'industrial_purchase' })
export class IndustrialPurchaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => EvaluationProcessEntity, (evaluation) => evaluation.industrial_purchases, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'evaluation_process_id' })
  evaluation_process: EvaluationProcessEntity;

  @Column({ type: 'date' })
  request_date: string;

  @Column({
    type: 'enum',
    enum: StateIndustrialPurchasingEnum,
    enumName: 'state_industrial_purchasing_enum',
    nullable: false,
  })
  purchase_status: StateIndustrialPurchasingEnum;

  @OneToMany(() => IndustrialPurchaseObservationEntity, (industrial_purchase_observ) => industrial_purchase_observ.industrial_purchase)
  industrial_purchase_observs: IndustrialPurchaseObservationEntity[];

  @OneToMany(() => IndustrialEvaluationEntity, evaluation => evaluation.industrial_purchase)
  industrial_evaluations: IndustrialEvaluationEntity[];
}
