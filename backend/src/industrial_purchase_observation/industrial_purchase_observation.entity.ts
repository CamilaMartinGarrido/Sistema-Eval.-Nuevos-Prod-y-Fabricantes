import { Entity, PrimaryGeneratedColumn, Unique, ManyToOne, JoinColumn } from 'typeorm';
import { IndustrialPurchaseEntity } from '../industrial_purchase/industrial_purchase.entity';
import { ObservationEntity } from '../observation/observation.entity';

@Unique(['industrial_purchase', 'observation'])
@Entity({ name: 'industrial_purchase_observation' })
export class IndustrialPurchaseObservationEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => IndustrialPurchaseEntity, (purchase) => purchase.industrial_purchase_observs, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'industrial_purchase_id' })
  industrial_purchase: IndustrialPurchaseEntity;
    
  @ManyToOne(() => ObservationEntity, (observation) => observation.industrial_purchase_observs, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'observation_id' })
  observation: ObservationEntity;
}
