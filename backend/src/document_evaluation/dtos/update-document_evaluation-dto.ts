import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateDocumentEvaluationDto {
  
  @IsNumber()
  @IsOptional()
  client_supply_id?: number;
  
  @IsNumber()
  @IsOptional()
  technical_document_id?: number;
  
  @IsString()
  @IsOptional()
  evaluation_date?: string;
  
  @IsBoolean()
  @IsOptional()
  is_approved?: boolean;
    
  @IsString()
  @IsOptional()
  send_date?: string;
}
