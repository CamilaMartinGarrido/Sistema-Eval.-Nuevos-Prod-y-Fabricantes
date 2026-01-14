import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique, Index } from 'typeorm';
import { ApplicationEntity } from '../application/application.entity';
import { ObservationEntity } from '../observation/observation.entity';

@Unique('uq_req_obs', ['application', 'observation'])
@Index('idx_req_obs_application', ['application'])
@Index('idx_req_obs_observation', ['observation'])
@Entity({ name: 'request_observation' })
export class RequestObservationEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => ApplicationEntity, (app) => app.request_observs, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'application_id' })
  application: ApplicationEntity;
    
  @ManyToOne(() => ObservationEntity, (observation) => observation.request_observs, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'observation_id' })
  observation: ObservationEntity;
}
