import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDocumentEvaluationDto {
  @IsNumber()
  @IsNotEmpty()
  client_supply_id: number;

  @IsNumber()
  @IsNotEmpty()
  technical_document_id: number;

  @IsString()
  @IsOptional()
  evaluation_date?: string;

  @IsBoolean()
  @IsOptional()
  is_approved?: boolean;
  
  @IsString()
  send_date: string;
}
