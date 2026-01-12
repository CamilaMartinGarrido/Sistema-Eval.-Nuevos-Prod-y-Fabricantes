import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';
import { EntityRoleEnum } from 'src/enums';

export class UpdateCommercialEntityDto {
  @IsString()
  @IsOptional()
  entity_name?: string;

  @IsString()
  @IsOptional()
  entity_country?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(EntityRoleEnum, { each: true })
  roles?: EntityRoleEnum[]; // Actualización de roles opcional
}
