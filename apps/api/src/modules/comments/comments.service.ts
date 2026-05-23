import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentsDto } from './dto/create-comments.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}
  async create(ticketId: number, userId: number, dto: CreateCommentsDto) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
    });
    if (!ticket) throw new NotFoundException('Ticket Not Found');
    return this.prisma.comment.create({
      data: {
        body: dto.body,
        ticketId,
        authorId: userId,
      },
      include: {
        author: { select: { id: true, name: true } },
      },
    });
  }

  findAll(ticketId: number) {
    return this.prisma.comment.findMany({
      where: { ticketId },
      include: {
        author: { select: { id: true, name: true } },
      },
    });
  }
}
