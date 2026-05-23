import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Role } from '@prisma/client';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AssignTicketDto } from './dto/assign-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  create(userId: number, dto: CreateTicketDto) {
    return this.prisma.ticket.create({
      data: {
        subject: dto.subject,
        description: dto.description,
        priority: dto.priority,
        createdById: userId,
      },
    });
  }

  findAll(user: { id: number; role: Role }) {
    if (user.role === Role.CUSTOMER) {
      return this.prisma.ticket.findMany({
        where: { createdById: user.id },
        include: {
          createdBy: { select: { id: true, name: true, email: true } },
          assignedTo: { select: { id: true, name: true, email: true } },
        },
      });
    }
    return this.prisma.ticket.findMany({
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async findOne(id: number) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
        comments: {
          include: { author: { select: { id: true, name: true } } },
        },
      },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');
    return ticket;
  }

  async updateStatus(
    id: number,
    dto: UpdateTicketDto,
    user: { id: number; role: Role },
  ) {
    const ticket = await this.findOne(id);

    if (user.role === Role.CUSTOMER && ticket.createdById !== user.id) {
      throw new ForbiddenException('Not your ticket');
    }

    return this.prisma.ticket.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  async assign(
    id: number,
    dto: AssignTicketDto,
    user: { id: number; role: Role },
  ) {
    if (user.role === Role.CUSTOMER) {
      throw new ForbiddenException('Customers cannot assign tickets');
    }
    await this.findOne(id);
    return this.prisma.ticket.update({
      where: { id },
      data: { assignedToId: dto.agentId },
    });
  }
}
