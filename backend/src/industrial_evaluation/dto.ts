import { ResultIndustrialAnalysisEnum } from 'src/enums';

export class CreateIndustrialEvaluationDto {
  industrial_purchase_id: number;
  send_batch_date?: string;
  reception_batch_date?: string;
  analysis_result: ResultIndustrialAnalysisEnum;
  report_delivery_date?: string;
}
