export class CreateDocumentEvaluationDto {
  client_supply_id: number;
  technical_document_id: number;
  evaluation_date?: string;
  is_approved?: boolean;
  send_date: string;
}
