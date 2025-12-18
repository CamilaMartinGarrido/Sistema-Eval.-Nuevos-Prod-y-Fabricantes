import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateObservationDto {
  @IsString()
  @IsNotEmpty()
  observation_text: string;

  @IsDate()
  @IsNotEmpty()
  observation_date: string;
}
