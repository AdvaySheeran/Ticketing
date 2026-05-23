import { IsEnum, IsOptional } from 'class-validator';
import { Status } from '@prisma/client';

export class UpdateTicketDto {
  @IsEnum(Status)
  @IsOptional()
  status!: Status;
}
