import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';
import { RoleEnum } from 'src/enums';

export class UpdateCommercialEntityDto {
  @IsString()
  @IsOptional()
  entity_name?: string;

  @IsString()
  @IsOptional()
  entity_country?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(RoleEnum, { each: true })
  roles?: RoleEnum[]; // Actualización de roles opcional
}
