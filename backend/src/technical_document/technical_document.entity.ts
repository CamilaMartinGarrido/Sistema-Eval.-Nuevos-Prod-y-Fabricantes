import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique, OneToMany, Index } from 'typeorm';
import { DocumentTypeEnum } from '../enums';
import { SupplyEntity } from '../supply/supply.entity';
import { DocumentEvaluationEntity } from '../document_evaluation/document_evaluation.entity';

@Unique('uq_technical_document', ['supply', 'document_name', 'document_type', 'version'])
@Index('idx_tech_doc_supply', ['supply'])
@Index('idx_tech_doc_version', ['version'])
@Index('idx_tech_doc_type', ['document_type'])
@Index('idx_tech_doc_request_date', ['request_date'])
@Entity({ name: 'technical_document' })
export class TechnicalDocumentEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => SupplyEntity, (supply) => supply.technical_documents, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'supply_id' })
  supply: SupplyEntity;

  @Column({ type: 'varchar', length: 255, nullable: false })
  document_name: string;

  @Column({
    type: 'enum',
    enum: DocumentTypeEnum,
    enumName: 'document_type_enum',
    nullable: false,
  })
  document_type: DocumentTypeEnum;

  @Column({ type: 'varchar', length: 100, nullable: false })
  version: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  file_path: string;

  @Column({ type: 'date', nullable: true })
  request_date: string;

  @Column({ type: 'date', nullable: true })
  receipt_date: string;

  @OneToMany(() => DocumentEvaluationEntity, document => document.technical_document)
  document_evals: DocumentEvaluationEntity[];
}
