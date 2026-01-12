import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { DocumentTypeEnum } from 'src/enums';

export class CreateTechnicalDocumentDto {
  @IsNumber()
  @IsNotEmpty()
  supply_id: number;

  @IsString()
  @IsNotEmpty()
  document_name: string;

  @IsNotEmpty()
  document_type: DocumentTypeEnum;

  @IsString()
  @IsNotEmpty()
  version: string;

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
