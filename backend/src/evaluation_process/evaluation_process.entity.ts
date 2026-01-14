import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne, OneToMany, Index, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import { ApplicationEntity } from '../application/application.entity';
import { SupplyEntity } from '../supply/supply.entity';
import { ExploratoryOfferEntity } from '../exploratory_offer/exploratory_offer.entity';
import { DocumentEvaluationEntity } from '../document_evaluation/document_evaluation.entity';
import { SampleEvaluationEntity } from '../sample_evaluation/sample_evaluation.entity';
import { IndustrialPurchaseEntity } from '../industrial_purchase/industrial_purchase.entity';
import { ArchiveReasonEnum, LifecycleStateEnum } from 'src/enums';
import { ManufacturerStatusEntity } from '../manufacturer_status/manufacturer_status.entity';

@Index('uq_evaluation_process_active', ['application', 'supply'], { unique: true, where: '"lifecycle_state" = \'Activo\'' })
@Index('idx_evaluation_process_app', ['application'])
@Index('idx_evaluation_process_supply', ['supply'])
@Index('idx_evaluation_process_state', ['lifecycle_state'])
@Index('idx_application_archived', ['archive_date'], { where: `"lifecycle_state" = 'Archivado'` })
@Index('idx_eval_process_app_state_date', ['application', 'lifecycle_state'])
@Entity({ name: 'evaluation_process' })
export class EvaluationProcessEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @OneToOne(() => ApplicationEntity, (app) => app.evaluations, {
    eager: true,        
    nullable: false,     
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  })
  @JoinColumn({ name: 'application_id' })
  application: ApplicationEntity;

  @ManyToOne(() => SupplyEntity, (supply) => supply.evaluations, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'supply_id' })
  supply: SupplyEntity;

  @Column({
    type: 'enum',
    enum: LifecycleStateEnum,
    enumName: 'lifecycle_state_enum',
    default: LifecycleStateEnum.ACTIVO,
    nullable: false,
  })
  lifecycle_state: LifecycleStateEnum;

  @Column({ type: 'date', nullable: true })
  archive_date: string;

  @Column({
    type: 'enum',
    enum: ArchiveReasonEnum,
    enumName: 'archive_reason_enum',
    nullable: true,
  })
  archive_reason: ArchiveReasonEnum;

  @OneToMany(() => ExploratoryOfferEntity, offer => offer.evaluation_process)
  exploratory_offers: ExploratoryOfferEntity[];

  @OneToMany(() => DocumentEvaluationEntity, document => document.evaluation_process)
  document_evals: DocumentEvaluationEntity[];

  @OneToMany(() => SampleEvaluationEntity, evaluation => evaluation.evaluation_process)
  sample_evaluations: SampleEvaluationEntity[];

  @OneToMany(() => IndustrialPurchaseEntity, purchase => purchase.evaluation_process)
  industrial_purchases: IndustrialPurchaseEntity[];

  @OneToMany(() => ManufacturerStatusEntity, (status) => status.evaluation_process)
  manufacturer_states: ManufacturerStatusEntity[];

  // Hook para validar antes de insertar/actualizar
  @BeforeInsert()
  @BeforeUpdate()
  validateArchiveConstraint() {
    if (this.lifecycle_state === LifecycleStateEnum.ARCHIVADO) {
      if (!this.archive_date) {
        throw new Error('archive_date is required when lifecycle_state is "Archivado"');
      }
      if (!this.archive_reason) {
        throw new Error('archive_reason is required when lifecycle_state is "Archivado"');
      }
    } else if (this.lifecycle_state === LifecycleStateEnum.ACTIVO) {
      if (this.archive_date !== null && this.archive_date !== undefined) {
        throw new Error('archive_date must be null when lifecycle_state is "Activo"');
      }
      if (this.archive_reason !== null && this.archive_reason !== undefined) {
        throw new Error('archive_reason must be null when lifecycle_state is "Activo"');
      }
    }
  }
}
