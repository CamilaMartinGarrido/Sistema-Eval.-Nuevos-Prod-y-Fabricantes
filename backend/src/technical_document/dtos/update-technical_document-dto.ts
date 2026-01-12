import { IsNumber, IsOptional, IsString } from 'class-validator';
import { DocumentTypeEnum } from 'src/enums';

export class UpdateTechnicalDocumentDto {
  @IsNumber()
  @IsOptional()
  supply_id?: number;

  @IsString()
  @IsOptional()
  document_name?: string;
  
  @IsOptional()
  document_type?: DocumentTypeEnum;
  
  @IsString()
  @IsOptional()
  version?: string;

  @IsString()
  @IsOptional()
  file_path?: string;
  
  @IsString()
  @IsOptional()
  request_date?: string;
  
  @IsString()
  @IsOptional()
  receipt_date?: string;
}
