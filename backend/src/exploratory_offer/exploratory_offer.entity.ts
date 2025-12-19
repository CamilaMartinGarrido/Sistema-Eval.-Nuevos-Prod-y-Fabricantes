import { ExploratoryOfferObservationEntity } from 'src/exploratory_offer_observation/exploratory_offer_observation.entity';
import { SupplyEntity } from 'src/supply/supply.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'exploratory_offer' })
export class ExploratoryOfferEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SupplyEntity, (supply) => supply.exploratory_offers, {
    eager: true,
    nullable: false,
    onDelete: 'NO ACTION', // o 'RESTRICT'
  })
  @JoinColumn({ name: 'supply_id' })
  supply: SupplyEntity;

  @Column({ type: 'boolean', nullable: true })
  is_competitive: boolean;

  @OneToMany(() => ExploratoryOfferObservationEntity, (exp_offer_observ) => exp_offer_observ.exploratory_offer)
  exploratory_offer_observs: ExploratoryOfferObservationEntity[];
}
