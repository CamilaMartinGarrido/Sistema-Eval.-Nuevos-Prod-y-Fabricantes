import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommercialEntityDto {
  @IsString()
  @IsNotEmpty()
  entity_name: string;

  @IsString()
  @IsNotEmpty()
  entity_country: string;
}
