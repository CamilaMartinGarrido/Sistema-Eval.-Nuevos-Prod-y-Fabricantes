import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { StateIndustrialPurchasingEnum } from 'src/enums';

export class UpdateIndustrialPurchaseDto {
  @IsNumber()
  @IsOptional()
  evaluation_process_id?: number;
  
  @IsString()
  @IsOptional()
  request_date?: string;
  
  @IsEnum(StateIndustrialPurchasingEnum)
  @IsOptional()
  purchase_status?: StateIndustrialPurchasingEnum;
}
