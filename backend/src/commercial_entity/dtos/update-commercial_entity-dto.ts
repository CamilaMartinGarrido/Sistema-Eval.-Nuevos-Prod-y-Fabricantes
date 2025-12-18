import { IsOptional, IsString } from 'class-validator';

export class UpdateCommercialEntityDto {
  @IsString()
  @IsOptional()
  entity_name?: string;

  @IsString()
  @IsOptional()
  entity_country?: string;
}
