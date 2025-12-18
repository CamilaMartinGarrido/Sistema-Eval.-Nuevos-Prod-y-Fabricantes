import { StateIndustrialPurchasingEnum } from 'src/enums';

export class CreateIndustrialPurchaseDto {
  client_supply_id: number;
  request_date: string;
  purchase_status: StateIndustrialPurchasingEnum;
}
