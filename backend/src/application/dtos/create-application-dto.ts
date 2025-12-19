import { OriginRequestEnum } from 'src/enums';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, IsEnum, IsOptional } from 'class-validator';

export class CreateApplicationDto {
  @IsNumber()
  @IsNotEmpty()
  application_number: number;

  @IsNumber()
  @IsNotEmpty()
  client_id: number;

  @IsNumber()
  @IsNotEmpty()
  product_id: number;

  @IsEnum(OriginRequestEnum)
  @IsNotEmpty()
  origin: OriginRequestEnum; // enum validado

  @IsString()
  @IsNotEmpty()
  receipt_date: string; // ISO date string

  @IsBoolean()
  @IsOptional()
  is_selected?: boolean; // opcional al crear
}
