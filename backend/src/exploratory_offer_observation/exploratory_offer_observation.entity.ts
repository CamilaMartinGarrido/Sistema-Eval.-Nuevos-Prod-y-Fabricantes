import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ExploratoryOfferEntity } from '../exploratory_offer/exploratory_offer.entity';
import { ObservationEntity } from '../observation/observation.entity';

@Entity({ name: 'exploratory_offer_observation' })
export class ExploratoryOfferObservationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ExploratoryOfferEntity, (expOffer) => expOffer.exploratory_offer_observs, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'exploratory_offer_id' })
  exploratory_offer: ExploratoryOfferEntity;
  
  @ManyToOne(() => ObservationEntity, (observation) => observation.exploratory_offer_observs, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'observation_id' })
  observation: ObservationEntity;
}
