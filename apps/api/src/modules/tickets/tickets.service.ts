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
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class TicketsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async create(userId: number, dto: CreateTicketDto) {
    const ticket = await this.prisma.ticket.create({
      data: {
        subject: dto.subject,
        description: dto.description,
        priority: dto.priority,
        createdById: userId,
      },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });
    await this.notificationsService.sendTicketCreated(
      ticket.createdBy.email,
      ticket.subject,
    );
    return ticket;
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

    const updatedTicket = await this.prisma.ticket.update({
      where: { id },
      data: { status: dto.status },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });
    if (dto.status === 'CLOSED') {
      await this.notificationsService.sendTicketCreated(
        ticket.createdBy.email,
        ticket.subject,
      );
    }
    return updatedTicket;
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
    const updatedTIcket = await this.prisma.ticket.update({
      where: { id },
      data: { assignedToId: dto.agentId },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });
    if (updatedTIcket.assignedToId) {
      await this.notificationsService.sendTicketCreated(
        updatedTIcket.createdBy.email,
        updatedTIcket.subject,
      );
    }
    return updatedTIcket;
  }
}
