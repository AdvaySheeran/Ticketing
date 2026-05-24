import { HttpClient } from "@angular/common/http";
import { Ticket } from "../../shared/models/ticket.model";
import { environment } from "../../../environments/environment";
import { Injectable } from "@angular/core";

@Injectable({
    'providedIn': 'root'
})

export class TicketService {
  private readonly apiUrl = `${environment.apiUrl}/tickets`;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Ticket[]>(this.apiUrl);
  }

  getOne(id: number) {
    return this.http.get<Ticket>(`${this.apiUrl}/${id}`);
  }

  create(data: { subject: string; description: string; priority: string }) {
    return this.http.post<Ticket>(this.apiUrl, data);
  }

  updateStatus(id: number, status: string) {
    return this.http.patch<Ticket>(`${this.apiUrl}/${id}/status`, { status });
  }

  assign(id: number, agentId: number) {
    return this.http.patch<Ticket>(`${this.apiUrl}/${id}/assign`, { agentId });
  }
}