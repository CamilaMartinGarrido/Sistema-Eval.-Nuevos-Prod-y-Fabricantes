import { ExploratoryOfferObservationEntity } from '../exploratory_offer_observation/exploratory_offer_observation.entity';
import { RequestObservationEntity } from '../request_observation/request_observation.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity({ name: 'observation' })
export class ObservationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  observation_text: string;

  @Column({ type: 'date' })
  observation_date: string;
  
  @OneToMany(() => ExploratoryOfferObservationEntity, (exp_offer_observ) => exp_offer_observ.observation)
  exploratory_offer_observs: ExploratoryOfferObservationEntity[];
  
  @OneToMany(() => RequestObservationEntity, (request_observ) => request_observ.observation)
  request_observs: RequestObservationEntity[];
}
