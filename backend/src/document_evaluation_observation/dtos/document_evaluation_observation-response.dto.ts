import { Expose, Type } from 'class-transformer';
import { DocumentEvaluationResponseDto } from 'src/document_evaluation/dtos/document_evaluation-response-dto';
import { ObservationResponseDto } from 'src/observation/dtos/observation-response-dto';

export class DocumentEvaluationObservationResponseDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => DocumentEvaluationResponseDto)
  document_evaluation: DocumentEvaluationResponseDto;

  @Expose()
  @Type(() => ObservationResponseDto)
  observation: ObservationResponseDto;
}
