import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
@Injectable()
export class NotificationsService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(NotificationsService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  private async send(to: string, subject: string, text: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject,
        text,
      });
      this.logger.log(`Email sent to ${to}`);
    } catch (err) {
      this.logger.error(`Failed to send email to ${to}`, err);
    }
  }

  async sendTicketCreated(to: string, subject: string) {
    await this.send(
      to,
      'New Ticket Created',
      `Your ticket "${subject}" has been created successfully.`,
    );
  }

  async sendTicketAssigned(to: string, subject: string) {
    await this.send(
      to,
      'Ticket Assigned',
      `Ticket "${subject}" has been assigned to you.`,
    );
  }

  async sendTicketResolved(to: string, subject: string) {
    await this.send(
      to,
      'Ticket Resolved',
      `Ticket ${subject} has been resolved.`,
    );
  }
}
