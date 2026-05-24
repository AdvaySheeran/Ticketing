import { Injectable, signal } from "@angular/core";
import { User } from "../../shared/models/user.model";
import { HttpClient } from "@angular/common/http";
import { TokenService } from "./token.service";
import { Router } from "@angular/router";
import { tap } from "rxjs";
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  currentUser = signal<User | null>(null);

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {}

  login(email: string, password: string) {
    return this.http.post<{ access_token: string }>
    (`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap(res => {
        this.tokenService.setToken(res.access_token);
        this.decodeAndSetUser(res.access_token);
      })
    );
  }

  logout(): void {
    this.tokenService.removeToken();
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  decodeAndSetUser(token: string): void {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.currentUser.set({
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        name: '',
        createdAt: ''
      });
    } catch {
      this.logout();
    }
  }

  initFromToken(): void {
    const token = this.tokenService.getToken();
    if (token) this.decodeAndSetUser(token);
  }

  isLoggedIn(): boolean {
    return this.tokenService.isLoggedIn();
  }

  getRole() {
    return this.currentUser()?.role;
  }
}