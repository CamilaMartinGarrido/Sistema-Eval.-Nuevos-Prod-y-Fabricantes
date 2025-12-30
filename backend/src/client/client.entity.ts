import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique } from 'typeorm';
import { ApplicationEntity } from '../application/application.entity';
import { ClientSupplyEntity } from '../client_supply/client_supply.entity';
import { SampleAnalysisEntity } from 'src/sample_analysis/sample_analysis.entity';
import { SampleEvaluationEntity } from 'src/sample_evaluation/sample_evaluation.entity';

@Unique(['client_name', 'client_country'])
@Entity({ name: 'client' })
export class ClientEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', nullable: false })
  client_name: string;

  @Column({ type: 'varchar', nullable: false })
  client_country: string;

  @OneToMany(() => ApplicationEntity, (application) => application.client)
  applications: ApplicationEntity[];

  @OneToMany(() => ClientSupplyEntity, (client_supply) => client_supply.client)
  client_supplies: ClientSupplyEntity[];

  @OneToMany(() => SampleAnalysisEntity, analysis => analysis.performed_by_client)
  sample_analyses: SampleAnalysisEntity[];

  @OneToMany(() => SampleEvaluationEntity, evaluation => evaluation.source_client)
  sample_evaluations: SampleEvaluationEntity[];
}
