import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiUrlService } from '../apiUrl/api-url.service';
import { Observable } from 'rxjs';
import { ResponsesSent } from '../../api/responsesSent/responsesSent.model';

@Injectable({
  providedIn: 'root'
})
export class ResponsesSentService {

    private readonly API_URL: string;


  constructor(private http: HttpClient, private apiUrlService: ApiUrlService) {
    this.API_URL = this.apiUrlService.apiGetFormulariosEnviadosByUserId();
  }

  getFormulariosEnviadosByUserId(id: string): Observable<ResponsesSent> {
    return this.http.get<ResponsesSent>(`${this.API_URL}/${id}`);
  }
}