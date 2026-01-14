import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique } from 'typeorm';
import { ApplicationEntity } from '../application/application.entity';
import { SampleAnalysisEntity } from '../sample_analysis/sample_analysis.entity';

@Unique('uq_client_ci', ['client_name', 'client_country'])
@Entity({ name: 'client' })
export class ClientEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  client_name: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  client_country: string;

  @OneToMany(() => ApplicationEntity, (application) => application.client)
  applications: ApplicationEntity[];

  @OneToMany(() => SampleAnalysisEntity, analysis => analysis.performed_by_client)
  sample_analyses: SampleAnalysisEntity[];
}
