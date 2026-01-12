import { Expose, Type } from 'class-transformer';
import { EvaluationProcessResponseDto } from 'src/evaluation_process/dtos/evaluation_process-response.dto';
import { TechnicalDocumentResponseDto } from 'src/technical_document/dtos/technical_document-response-dto';

export class DocumentEvaluationResponseDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => EvaluationProcessResponseDto)
  evaluation_process: EvaluationProcessResponseDto;

  @Expose()
  @Type(() => TechnicalDocumentResponseDto)
  technical_document: TechnicalDocumentResponseDto;

  @Expose()
  send_date: string;
    
  @Expose()
  evaluation_date: string;
    
  @Expose()
  is_approved: boolean;
}
