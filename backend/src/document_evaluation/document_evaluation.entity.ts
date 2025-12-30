import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne, JoinColumn } from 'typeorm';
import { ClientSupplyEntity } from '../client_supply/client_supply.entity';
import { TechnicalDocumentEntity } from '../technical_document/technical_document.entity';

@Unique(['client_supply', 'technical_document'])
@Entity({ name: 'document_evaluation' })
export class DocumentEvaluationEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => ClientSupplyEntity, (cs) => cs.document_evals, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'client_supply_id' })
  client_supply: ClientSupplyEntity;

  @ManyToOne(() => TechnicalDocumentEntity, (td) => td.document_evals, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'technical_document_id' })
  technical_document: TechnicalDocumentEntity;

  @Column({ type: 'date', nullable: true })
  evaluation_date: string;

  @Column({ type: 'boolean', nullable: true })
  is_approved: boolean;

  @Column({ type: 'date' })
  send_date: string;
}
