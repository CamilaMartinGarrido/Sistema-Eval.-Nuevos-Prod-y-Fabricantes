import { ExploratoryOfferEntity } from 'src/exploratory_offer/exploratory_offer.entity';
import { ObservationEntity } from 'src/observation/observation.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'exploratory_offer_observation' })
export class ExploratoryOfferObservationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ExploratoryOfferEntity, (expOffer) => expOffer.exploratory_offer_observs, {
    eager: true,
    nullable: false,
    onDelete: 'NO ACTION', // o 'RESTRICT'
  })
  @JoinColumn({ name: 'exploratory_offer_id' })
  exploratory_offer: ExploratoryOfferEntity;
  
  @ManyToOne(() => ObservationEntity, (observation) => observation.exploratory_offer_observs, {
    eager: true,
    nullable: false,
    onDelete: 'NO ACTION', // o 'RESTRICT'
  })
  @JoinColumn({ name: 'observation_id' })
  observation: ObservationEntity;

  @CreateDateColumn({ type: 'timestamp' })
  created_at_ExploratoryOfferObservation: Date;
}
