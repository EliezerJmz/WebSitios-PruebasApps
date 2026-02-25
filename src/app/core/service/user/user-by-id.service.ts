import { Injectable } from '@angular/core';
import { ApiUrlService } from '../apiUrl/api-url.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserById } from '../../api/user-by-id/userById.model'; 

@Injectable({
  providedIn: 'root'
})
export class UserByIdService {

   private apiUrl: string;
  constructor(private http: HttpClient, private apiUrlService: ApiUrlService) {
        this.apiUrl = this.apiUrlService.apiUserById();
    }

  getUserById(id: string): Observable<UserById> {
    return this.http.get<UserById>(`${this.apiUrl}/${id}`);
  }
}
