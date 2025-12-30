import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateSampleDto {
  @IsNumber()
  @IsNotEmpty()
  supply_id: number;

  @IsString()
  @IsOptional()
  request_date?: string;

  @IsString()
  @IsOptional()
  send_date_supplier?: string;

  @IsString()
  @IsOptional()
  date_receipt_warehouse?: string;

  @IsString()
  @IsOptional()
  date_receipt_client?: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  unit: string;

  @IsString()
  @IsNotEmpty()
  sample_code: string;
}
