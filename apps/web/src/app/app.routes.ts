import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
    {
        path:'',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
        },
    {
        path: 'tickets',
        canActivate: [authGuard],
        loadComponent: () => import('./features/tickets/ticket-list/ticket-list.component').then(m => m.TicketListComponent)
    },
    {
        path: 'tickets/create',
        canActivate: [authGuard],
        loadComponent: () => import('./features/tickets/ticket-create/ticket-create.component').then(m => m.TicketCreateComponent)
    },
    {
        path: 'tickets/:id',
        canActivate: [authGuard],
        loadComponent: () => import('./features/tickets/ticket-detail/ticket-detail.component').then(m => m.TicketDetailComponent)
    },
    {
        path: 'admin/users',
        canActivate: [authGuard, roleGuard(['ADMIN'])],
        loadComponent: () => import('./features/admin/user-management/user-management.component').then(m => m.UserManagementComponent)
    },
    {
        path: '**',
        redirectTo: 'tickets'
    }
];
