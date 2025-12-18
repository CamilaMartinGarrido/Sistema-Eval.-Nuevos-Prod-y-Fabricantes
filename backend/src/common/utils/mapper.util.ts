import { plainToInstance } from 'class-transformer';

export function toDto<T, V>(dto: new () => T, entity: V): T {
  return plainToInstance(dto, entity, {
    excludeExtraneousValues: true,
  });
}
