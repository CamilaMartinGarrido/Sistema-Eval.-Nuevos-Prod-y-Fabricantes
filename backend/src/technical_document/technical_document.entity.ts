import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique, OneToMany, Index } from 'typeorm';
import { DocumentTypeEnum } from '../enums';
import { SupplyEntity } from '../supply/supply.entity';
import { DocumentEvaluationEntity } from '../document_evaluation/document_evaluation.entity';

@Unique(['supply', 'document_name', 'document_type', 'version'])
@Index('idx_tech_doc_supply', ['supply'])
@Index('idx_tech_doc_version', ['version'])
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

  @Column({ type: 'varchar' })
  document_name: string;

  @Column({
    type: 'enum',
    enum: DocumentTypeEnum,
    enumName: 'document_type_enum',
    nullable: false,
  })
  document_type: DocumentTypeEnum;

  @Column({ type: 'varchar' })
  version: string;

  @Column({ type: 'varchar', nullable: true })
  file_path: string;

  @Column({ type: 'date', nullable: true })
  request_date: string;

  @Column({ type: 'date', nullable: true })
  receipt_date: string;

  @OneToMany(() => DocumentEvaluationEntity, document => document.technical_document)
  document_evals: DocumentEvaluationEntity[];
}
