import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { CommentsService } from './comments.service';
import { CreateCommentsDto } from './dto/create-comments.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('tickets/:ticketId/comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post()
  create(
    @Param('ticketId', ParseIntPipe) ticketId: number,
    @Body() dto: CreateCommentsDto,
    @GetUser() user: { id: number; role: Role },
  ) {
    return this.commentsService.create(ticketId, user.id, dto);
  }

  @Get()
  findAll(@Param('ticketId', ParseIntPipe) ticketId: number) {
    return this.commentsService.findAll(ticketId);
  }
}
