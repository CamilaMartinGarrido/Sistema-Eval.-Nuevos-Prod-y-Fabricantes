import { Expose } from 'class-transformer';

export class ObservationResponseDto {
  @Expose()
  id: number;

  @Expose()
  observation_text: string;

  @Expose()
  observation_date: string;

  @Expose()
  created_at_Observation: Date;
}
