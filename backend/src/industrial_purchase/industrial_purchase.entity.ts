import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { StateIndustrialPurchasingEnum } from '../enums';
import { ClientSupplyEntity } from '../client_supply/client_supply.entity';
import { IndustrialPurchaseObservationEntity } from '../industrial_purchase_observation/industrial_purchase_observation.entity';
import { IndustrialEvaluationEntity } from '../industrial_evaluation/industrial_evaluation.entity';

@Unique(['client_supply'])
@Entity({ name: 'industrial_purchase' })
export class IndustrialPurchaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => ClientSupplyEntity, (clientSupply) => clientSupply.industrial_purchases, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'client_supply_id' })
  client_supply: ClientSupplyEntity;

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
