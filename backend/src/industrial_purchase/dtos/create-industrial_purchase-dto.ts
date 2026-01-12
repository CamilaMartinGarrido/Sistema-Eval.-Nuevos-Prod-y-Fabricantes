import { IsNotEmpty, IsNumber, IsString, IsEnum } from 'class-validator';
import { StateIndustrialPurchasingEnum } from 'src/enums';

export class CreateIndustrialPurchaseDto {
  @IsNumber()
  @IsNotEmpty()
  evaluation_process_id: number;

  @IsString()
  @IsNotEmpty()
  request_date: string;

  @IsEnum(StateIndustrialPurchasingEnum)
  @IsNotEmpty()
  purchase_status: StateIndustrialPurchasingEnum;
}
