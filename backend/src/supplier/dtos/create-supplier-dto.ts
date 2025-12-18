import {
  IsNumber,
  ValidateIf,
  ValidateNested,
  IsObject,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCommercialEntityDto } from 'src/commercial_entity/dtos';

export class CreateSupplierDto {
  @ValidateIf((o) => !o.commercial_entity) // Solo es requerido si NO viene commercial_entity
  @IsNumber({}, { message: 'commercial_entity_id debe ser un número' })
  @IsOptional()
  commercial_entity_id?: number;

  @ValidateIf((o) => !o.commercial_entity_id) // Solo es requerido si NO viene id
  @IsObject()
  @ValidateNested()
  @Type(() => CreateCommercialEntityDto)
  @IsOptional()
  commercial_entity?: CreateCommercialEntityDto;
}
