import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DocumentTypeEnum } from '../enums';
import { SupplyEntity } from '../supply/supply.entity';

@Entity({ name: 'technical_document' })
export class TechnicalDocumentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SupplyEntity, (supply) => supply.technicalDocuments, {
    eager: true,
    nullable: false,
    onDelete: 'NO ACTION', // o 'RESTRICT'
  })
  @JoinColumn({ name: 'supply_id' })
  supply: SupplyEntity;

  @Column({
    type: 'enum',
    enum: DocumentTypeEnum,
    enumName: 'document_type_enum',
    nullable: false,
  })
  document_type: DocumentTypeEnum;

  @Column({ type: 'varchar' })
  version: string;

  @Column({ type: 'date', nullable: true })
  request_date: string;

  @Column({ type: 'date', nullable: true })
  receipt_date: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at_TechnicalDocument: Date;
}
