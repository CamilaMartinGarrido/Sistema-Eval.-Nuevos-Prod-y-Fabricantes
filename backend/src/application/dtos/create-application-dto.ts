import { OriginRequestEnum } from 'src/enums';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

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

  @IsNotEmpty()
  origin: OriginRequestEnum;

  @IsString()
  @IsNotEmpty()
  receipt_date: string;

  @IsBoolean()
  is_selected: boolean;
}
