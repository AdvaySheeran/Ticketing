import { DatePipe, LowerCasePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TicketService } from '../../../core/services/ticket.service';
import { CommentService } from '../../../core/services/comment.service';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { Ticket } from '../../../shared/models/ticket.model';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-ticket-detail',
  imports: [ReactiveFormsModule, RouterLink, DatePipe, LowerCasePipe],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.scss',
})
export class TicketDetailComponent implements OnInit {
  ticket = signal<Ticket | null>(null);
  agents = signal<User[]>([]);
  loading = signal(true);
  error = signal('');
  commentForm: FormGroup;
  submittingComment = signal(false);

  statuses = ['OPEN', 'IN_PROGRESS', 'CLOSED'];

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private commentService: CommentService,
    private userService: UserService,
    public authService: AuthService,
    private fb: FormBuilder
  ) {
    this.commentForm = this.fb.group({
      body: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTicket(id);

    if (this.authService.getRole() !== 'CUSTOMER') {
      this.userService.getAll().subscribe({
        next: (users) => this.agents.set(users.filter(u => u.role === 'AGENT'))
      });
    }
  }

  loadTicket(id: number): void {
    this.ticketService.getOne(id).subscribe({
      next: (data) => {
        this.ticket.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load ticket');
        this.loading.set(false);
      }
    });
  }

  updateStatus(status: string): void {
    const id = this.ticket()!.id;
    this.ticketService.updateStatus(id, status).subscribe({
      next: () => this.loadTicket(id)
    });
  }

  assign(agentId: string): void {
    const id = this.ticket()!.id;
    this.ticketService.assign(id, Number(agentId)).subscribe({
      next: () => this.loadTicket(id)
    });
  }

  addComment(): void {
    if (this.commentForm.invalid) return;
    const id = this.ticket()!.id;
    this.submittingComment.set(true);

    this.commentService.create(id, this.commentForm.value.body).subscribe({
      next: () => {
        this.commentForm.reset();
        this.submittingComment.set(false);
        this.loadTicket(id);
      },
      error: () => this.submittingComment.set(false)
    });
  }
}
