import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'request_observation' })
export class RequestObservationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  application_id: number;

  @Column({ type: 'int' })
  observation_id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
