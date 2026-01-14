import { Type } from 'class-transformer';
import { IsNumber, IsObject, IsOptional, ValidateIf, ValidateNested } from 'class-validator';
import { CreateObservationDto } from 'src/observation/dtos/create-observation-dto';

export class UpdateDocumentEvaluationObservationDto {
  @IsNumber()
  @IsOptional()
  document_evaluation_id?: number;

  @ValidateIf((o) => !o.observation)
  @IsNumber()
  @IsOptional()
  observation_id?: number;
  
  @ValidateIf((o) => !o.observation_id) 
  @IsObject()
  @ValidateNested()
  @Type(() => CreateObservationDto)
  @IsOptional()
  observation?: CreateObservationDto;
}
