import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsObject, IsOptional, ValidateIf, ValidateNested } from 'class-validator';
import { CreateObservationDto } from 'src/observation/dtos/create-observation-dto';

export class CreateIndustrialEvaluationObservationDto {
  @IsNumber()
  @IsNotEmpty()
  industrial_evaluation_id: number;

  @ValidateIf((o) => !o.observation) // Solo es requerido si NO viene observation
  @IsNumber()
  @IsOptional()
  observation_id?: number;

  @ValidateIf((o) => !o.observation_id) // Solo es requerido si NO viene id
  @IsObject()
  @ValidateNested()
  @Type(() => CreateObservationDto)
  @IsOptional()
  observation?: CreateObservationDto;
}
