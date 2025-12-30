import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateSampleDto {
  @IsNumber()
  @IsOptional()
  supply_id?: number;

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
  @IsOptional()
  quantity?: number;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsString()
  @IsOptional()
  sample_code?: string;
}
