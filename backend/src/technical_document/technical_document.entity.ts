import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique, OneToMany } from 'typeorm';
import { DocumentTypeEnum } from '../enums';
import { SupplyEntity } from '../supply/supply.entity';
import { DocumentEvaluationEntity } from '../document_evaluation/document_evaluation.entity';

@Unique(['supply', 'document_type', 'version'])
@Entity({ name: 'technical_document' })
export class TechnicalDocumentEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => SupplyEntity, (supply) => supply.technical_documents, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
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

  @OneToMany(() => DocumentEvaluationEntity, document => document.technical_document)
  document_evals: DocumentEvaluationEntity[];
}
