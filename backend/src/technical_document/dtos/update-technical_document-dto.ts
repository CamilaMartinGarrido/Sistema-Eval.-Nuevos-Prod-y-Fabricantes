import { IsNumber, IsOptional, IsString } from 'class-validator';
import { DocumentTypeEnum } from 'src/enums';

export class UpdateTechnicalDocumentDto {
  @IsNumber()
  @IsOptional()
  supply_id?: number;
  
  @IsOptional()
  document_type?: DocumentTypeEnum;
  
  @IsString()
  @IsOptional()
  version?: string;
  
  @IsString()
  @IsOptional()
  request_date?: string;
  
  @IsString()
  @IsOptional()
  receipt_date?: string;
}
