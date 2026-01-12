import { IsNotEmpty, IsString, IsOptional, IsArray, IsEnum } from 'class-validator';
import { EntityRoleEnum } from 'src/enums';

export class CreateCommercialEntityDto {
  @IsString()
  @IsNotEmpty()
  entity_name: string;

  @IsString()
  @IsNotEmpty()
  entity_country: string;

  @IsOptional()
  @IsArray()
  @IsEnum(EntityRoleEnum, { each: true })
  roles?: EntityRoleEnum[];
}
