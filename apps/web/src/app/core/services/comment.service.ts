import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})

export class CommentService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(ticketId: number) {
    return this.http.get<Comment[]>(`${this.apiUrl}/tickets/${ticketId}/comments`);
  }

  create(ticketId: number, body: string) {
    return this.http.post<Comment>(`${this.apiUrl}/tickets/${ticketId}/comments`, { body });
  }
}