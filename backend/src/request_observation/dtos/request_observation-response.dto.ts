import { Expose, Type } from 'class-transformer';
import { ApplicationResponseDto } from 'src/application/dtos/application-response.dto';
import { ObservationResponseDto } from 'src/observation/dtos/observation-response-dto';

export class RequestObservationResponseDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => ApplicationResponseDto)
  application: ApplicationResponseDto;

  @Expose()
  @Type(() => ObservationResponseDto)
  observation: ObservationResponseDto;
}
