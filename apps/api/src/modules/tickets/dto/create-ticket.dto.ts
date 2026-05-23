import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { Priority } from '@prisma/client';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  subject!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsEnum(Priority)
  priority!: Priority;
}
