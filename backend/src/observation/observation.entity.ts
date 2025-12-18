import { ExploratoryOfferObservationEntity } from 'src/exploratory_offer_observation/exploratory_offer_observation.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'observation' })
export class ObservationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  observation_text: string;

  @Column({ type: 'date' })
  observation_date: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at_Observation: Date;
  
  @OneToMany(() => ExploratoryOfferObservationEntity, (exp_offer_observ) => exp_offer_observ.observation)
  exploratory_offer_observs: ExploratoryOfferObservationEntity[];
}
