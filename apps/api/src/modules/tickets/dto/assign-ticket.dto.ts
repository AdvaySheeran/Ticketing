import { IsNumber, IsNotEmpty } from 'class-validator';

export class AssignTicketDto {
  @IsNumber()
  @IsNotEmpty()
  agentId!: number;
}
