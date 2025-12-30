import { Expose, Type } from 'class-transformer';
import { ClientSupplyResponseDto } from 'src/client_supply/dtos/client_supply-response.dto';
import { TechnicalDocumentResponseDto } from 'src/technical_document/dtos/technical_document-response-dto';

export class DocumentEvaluationResponseDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => ClientSupplyResponseDto)
  client_supply: ClientSupplyResponseDto;

  @Expose()
  @Type(() => TechnicalDocumentResponseDto)
  technical_document: TechnicalDocumentResponseDto;
    
  @Expose()
  evaluation_date: string;
    
  @Expose()
  is_approved: boolean;
      
  @Expose()
  send_date: string;
}
