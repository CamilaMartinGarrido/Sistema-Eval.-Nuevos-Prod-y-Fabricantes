import { OriginRequestEnum } from 'src/enums';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, IsEnum, IsOptional } from 'class-validator';

export class CreateApplicationDto {
  @IsNumber()
  @IsNotEmpty()
  application_number: number;

  @IsNumber()
  @IsNotEmpty()
  client_id: number;

  @IsEnum(OriginRequestEnum)
  @IsNotEmpty()
  origin: OriginRequestEnum;

  @IsString()
  @IsNotEmpty()
  receipt_date: string;

  @IsBoolean()
  @IsOptional()
  is_selected?: boolean;
}
