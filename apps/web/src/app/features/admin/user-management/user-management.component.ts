import { Component, OnInit, signal } from '@angular/core';
import { User } from '../../../shared/models/user.model';
import { UserService } from '../../../core/services/user.service';
import { RouterLink } from '@angular/router';
import { DatePipe, LowerCasePipe } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-user-management',
  imports: [RouterLink, DatePipe, LowerCasePipe],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent implements OnInit {
  users = signal<User[]>([]);
  loading = signal(true);
  error = signal('');
  success = signal('');

  roles = ['ADMIN', 'AGENT', 'CUSTOMER'];

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load users');
        this.loading.set(false);
      }
    });
  }

  updateRole(userId: number, role: string): void {
    this.userService.updateRole(Number(userId), role).subscribe({
      next: () => {
        this.success.set('Role updated successfully');
        this.loadUsers();
        setTimeout(() => this.success.set(''), 5000);
      }
    });
  }

  isSelf(userId: number): boolean {
  return this.authService.currentUser()?.id === userId;
}
}
