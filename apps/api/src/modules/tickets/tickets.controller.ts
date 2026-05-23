import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { Role } from '@prisma/client';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AssignTicketDto } from './dto/assign-ticket.dto';

@UseGuards(JwtGuard, RolesGuard)
@Controller('tickets')
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  @Post()
  create(
    @Body() dto: CreateTicketDto,
    @GetUser() user: { id: number; role: Role },
  ) {
    return this.ticketsService.create(user.id, dto);
  }

  @Get()
  findAll(@GetUser() user: { id: number; role: Role }) {
    return this.ticketsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ticketsService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTicketDto,
    @GetUser() user: { id: number; role: Role },
  ) {
    return this.ticketsService.updateStatus(id, dto, user);
  }

  @Patch(':id/assign')
  @Roles(Role.ADMIN, Role.AGENT)
  assign(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignTicketDto,
    @GetUser() user: { id: number; role: Role },
  ) {
    return this.ticketsService.assign(id, dto, user);
  }
}
