import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ResultSampleAnalysisEnum } from '../enums';
import { SampleEntity } from '../sample/sample.entity';
import { ClientEntity } from '../client/client.entity';
import { SampleAnalysisObservationEntity } from '../sample_analysis_observation/sample_analysis_observation.entity';

@Unique(['sample', 'performed_by_client', 'analysis_date'])
@Entity({ name: 'sample_analysis' })
export class SampleAnalysisEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => SampleEntity, (sample) => sample.sample_analyses, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'sample_id' })
  sample: SampleEntity;

  @ManyToOne(() => ClientEntity, (client) => client.sample_analyses, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'performed_by_client' })
  performed_by_client: ClientEntity;

  @Column({ type: 'date' })
  analysis_date: string;

  @Column({
    type: 'enum',
    enum: ResultSampleAnalysisEnum,
    enumName: 'result_sample_analysis_enum',
    nullable: false,
  })
  result: ResultSampleAnalysisEnum;

  @OneToMany(() => SampleAnalysisObservationEntity, (sample_analysis_observ) => sample_analysis_observ.sample_analysis)
  sample_analysis_observs: SampleAnalysisObservationEntity[];
}
