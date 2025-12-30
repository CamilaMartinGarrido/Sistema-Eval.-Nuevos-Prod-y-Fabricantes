import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne, JoinColumn } from 'typeorm';
import { ObservationEntity } from '../observation/observation.entity';
import { SampleAnalysisEntity } from '../sample_analysis/sample_analysis.entity';

@Unique(['sample_analysis', 'observation'])
@Entity({ name: 'sample_analysis_observation' })
export class SampleAnalysisObservationEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => SampleAnalysisEntity, (analysis) => analysis.sample_analysis_observs, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'sample_analysis_id' })
  sample_analysis: SampleAnalysisEntity;
    
  @ManyToOne(() => ObservationEntity, (observation) => observation.sample_analysis_observs, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'observation_id' })
  observation: ObservationEntity;
}
