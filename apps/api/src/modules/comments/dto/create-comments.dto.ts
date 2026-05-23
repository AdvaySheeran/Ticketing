import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentsDto {
  @IsString()
  @IsNotEmpty()
  body!: string;
}
