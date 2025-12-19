import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'document_evaluation' })
export class DocumentEvaluationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  client_supply_id: number;

  @Column({ type: 'int' })
  technical_document_id: number;

  @Column({ type: 'date', nullable: true })
  evaluation_date: string;

  @Column({ type: 'boolean', nullable: true })
  is_approved: boolean;

  @Column({ type: 'date' })
  send_date: string;
}
