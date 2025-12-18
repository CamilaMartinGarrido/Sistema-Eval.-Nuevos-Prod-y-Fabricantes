import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'industrial_purchase_observation' })
export class IndustrialPurchaseObservationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  industrial_purchase_id: number;

  @Column({ type: 'int' })
  observation_id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
