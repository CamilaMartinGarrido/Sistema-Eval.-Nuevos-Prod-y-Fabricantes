import {
  IsNumber,
  ValidateIf,
  ValidateNested,
  IsObject,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateCommercialEntityDto } from 'src/commercial_entity/dtos';

export class UpdateMakerDto {
  @IsOptional()
  @IsNumber()
  @ValidateIf((o: UpdateMakerDto) => !o.commercial_entity)
  commercial_entity_id?: number;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateCommercialEntityDto)
  @ValidateIf((o: UpdateMakerDto) => !o.commercial_entity_id)
  commercial_entity?: UpdateCommercialEntityDto;
}
