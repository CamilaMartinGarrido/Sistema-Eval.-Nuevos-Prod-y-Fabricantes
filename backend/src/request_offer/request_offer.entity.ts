import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'request_offer' })
export class RequestOfferEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  application_id: number;

  @Column({ type: 'int' })
  exploratory_offer_id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
