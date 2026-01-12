import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateDocumentEvaluationDto {
  
  @IsNumber()
  @IsOptional()
  evaluation_process_id?: number;
  
  @IsNumber()
  @IsOptional()
  technical_document_id?: number;

  @IsString()
  @IsOptional()
  send_date?: string;
  
  @IsString()
  @IsOptional()
  evaluation_date?: string;
  
  @IsBoolean()
  @IsOptional()
  is_approved?: boolean;
}
