import { OriginRequestEnum } from 'src/enums';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateApplicationDto {
  @IsNumber()
  @IsOptional()
  application_number?: number;

  @IsNumber()
  @IsOptional()
  client_id?: number;

  @IsNumber()
  @IsOptional()
  product_id?: number;

  @IsOptional()
  origin?: OriginRequestEnum;

  @IsString()
  @IsOptional()
  receipt_date?: string;

  @IsBoolean()
  @IsOptional()
  is_selected?: boolean;
}
