export class CreateSampleEvaluationDto {
  client_supply_id: number;
  sample_id: number;
  sample_analysis_id: number;
  self_performed: boolean;
  source_client?: number;
  decision_continue?: boolean;
}
