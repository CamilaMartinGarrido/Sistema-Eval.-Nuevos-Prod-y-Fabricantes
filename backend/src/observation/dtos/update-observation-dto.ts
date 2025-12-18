import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateObservationDto {
  @IsString()
  @IsOptional()
  observation_text?: string;

  @IsDate()
  @IsOptional()
  observation_date?: string;
}
