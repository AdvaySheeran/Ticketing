import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { User } from "../../shared/models/user.model";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly apiUrl = `${environment.apiUrl}/users`;
    
    constructor(private http: HttpClient) {}

    getAll() {
        return this.http.get<User[]>(this.apiUrl)
    }

    updateRole(id: number, role: string) {
        return this.http.patch<User>(`${this.apiUrl}/${id}/role`, { role });
    }
}