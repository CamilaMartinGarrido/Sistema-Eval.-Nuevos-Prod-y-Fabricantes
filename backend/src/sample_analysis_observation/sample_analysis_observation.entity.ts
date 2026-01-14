import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ObservationEntity } from '../observation/observation.entity';
import { SampleAnalysisEntity } from '../sample_analysis/sample_analysis.entity';

@Unique('uq_sa_obs', ['sample_analysis', 'observation'])
@Index('idx_sa_obs_analysis', ['sample_analysis'])
@Index('idx_sa_obs_observation', ['observation'])
@Entity({ name: 'sample_analysis_observation' })
export class SampleAnalysisObservationEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => SampleAnalysisEntity, (analysis) => analysis.sample_analysis_observs, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sample_analysis_id' })
  sample_analysis: SampleAnalysisEntity;
    
  @ManyToOne(() => ObservationEntity, (observation) => observation.sample_analysis_observs, {
    eager: true,
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'observation_id' })
  observation: ObservationEntity;
}
