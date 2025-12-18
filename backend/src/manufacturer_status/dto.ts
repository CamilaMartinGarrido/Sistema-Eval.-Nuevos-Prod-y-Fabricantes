import { FinalStateManufacturerEnum } from 'src/enums';

export class CreateManufacturerStatusDto {
  maker_product_id: number;
  status_date: string;
  final_state?: FinalStateManufacturerEnum;
}
