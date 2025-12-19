import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApplicationEntity } from '../application/application.entity';
import { ObservationEntity } from '../observation/observation.entity';

@Entity({ name: 'request_observation' })
export class RequestObservationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ApplicationEntity, (app) => app.request_observs, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'application_id' })
  application: ApplicationEntity;
    
  @ManyToOne(() => ObservationEntity, (observation) => observation.request_observs, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'observation_id' })
  observation: ObservationEntity;
}
