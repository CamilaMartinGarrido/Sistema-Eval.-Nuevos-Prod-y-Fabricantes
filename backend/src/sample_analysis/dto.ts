import { ResultSampleAnalysisEnum } from 'src/enums';

export class CreateSampleAnalysisDto {
  sample_id: number;
  performed_by_client: number;
  analysis_date: string;
  result: ResultSampleAnalysisEnum;
}
