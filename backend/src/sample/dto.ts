export class CreateSampleDto {
  supply_id: number;
  request_date?: string;
  send_date_supplier?: string;
  date_receipt_warehouse?: string;
  date_receipt_client?: string;
  quantity: number;
  unit: string;
  sample_code: string;
}
