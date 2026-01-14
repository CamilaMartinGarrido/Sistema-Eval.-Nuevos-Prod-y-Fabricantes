import { Entity, PrimaryGeneratedColumn, Unique, ManyToOne, JoinColumn, Index } from 'typeorm';
import { IndustrialPurchaseEntity } from '../industrial_purchase/industrial_purchase.entity';
import { ObservationEntity } from '../observation/observation.entity';

@Unique('uq_ip_obs', ['industrial_purchase', 'observation'])
@Index('idx_ip_obs_purchase', ['industrial_purchase'])
@Index('idx_ip_obs_observation', ['observation'])
@Entity({ name: 'industrial_purchase_observation' })
export class IndustrialPurchaseObservationEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => IndustrialPurchaseEntity, (purchase) => purchase.industrial_purchase_observs, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'industrial_purchase_id' })
  industrial_purchase: IndustrialPurchaseEntity;
    
  @ManyToOne(() => ObservationEntity, (observation) => observation.industrial_purchase_observs, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'observation_id' })
  observation: ObservationEntity;
}
