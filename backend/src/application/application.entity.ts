import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne, OneToMany, Unique, Index } from 'typeorm';
import { ArchiveReasonEnum, LifecycleStateEnum, OriginRequestEnum } from '../enums';
import { ClientEntity } from '../client/client.entity';
import { ApplicationProductEntity } from '../application_product/application_product.entity';
import { RequestObservationEntity } from '../request_observation/request_observation.entity';
import { EvaluationProcessEntity } from '../evaluation_process/evaluation_process.entity';

@Unique('uq_application_number', ['application_number'])
@Unique('uq_application_client', ['client', 'receipt_date'])
@Index('idx_application_client', ['client'])
@Index('idx_application_receipt_date', ['receipt_date'])
@Index('idx_application_selected', ['is_selected'], { where: `"is_selected" = true` })
@Index('idx_application_active', ['lifecycle_state'], { where: `"lifecycle_state" = 'Activo'` })
@Index('idx_application_archived', ['lifecycle_state', 'archive_date'], { where: `"lifecycle_state" = 'Archivado'` })
@Entity({ name: 'application' })
export class ApplicationEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int', nullable: false })
  application_number: number;

  @ManyToOne(() => ClientEntity, (client) => client.applications, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'client_id' })
  client: ClientEntity;

  @Column({
    type: 'enum',
    enum: OriginRequestEnum,
    enumName: 'origin_request_enum',
    nullable: false,
  })
  origin: OriginRequestEnum;

  @Column({ type: 'date', nullable: false })
  receipt_date: string;

  @Column({ type: 'boolean', nullable: true })
  is_selected: boolean;

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

  @OneToMany(() => RequestObservationEntity, (request_observ) => request_observ.application)
  request_observs: RequestObservationEntity[];

  @OneToMany(() => ApplicationProductEntity, (app_product) => app_product.application)
  app_products: ApplicationProductEntity[];

  @OneToOne(() => EvaluationProcessEntity, (evaluation) => evaluation.application)
  evaluations: EvaluationProcessEntity;
}
