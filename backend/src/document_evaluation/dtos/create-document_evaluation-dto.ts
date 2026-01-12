import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDocumentEvaluationDto {
  @IsNumber()
  @IsNotEmpty()
  evaluation_process_id: number;

  @IsNumber()
  @IsNotEmpty()
  technical_document_id: number;

  @IsString()
  send_date: string;

  @IsString()
  @IsOptional()
  evaluation_date?: string;

  @IsBoolean()
  @IsOptional()
  is_approved?: boolean;
}
