import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { DocumentTypeEnum } from 'src/enums';

export class CreateTechnicalDocumentDto {
  @IsNumber()
  @IsNotEmpty()
  supply_id: number;

  @IsNotEmpty()
  document_type: DocumentTypeEnum;

  @IsString()
  @IsNotEmpty()
  version: string;

  @IsString()
  request_date: string;

  @IsString()
  receipt_date: string;
}
