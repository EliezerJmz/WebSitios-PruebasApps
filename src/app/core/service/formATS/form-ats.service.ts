import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormATS } from '../../api/FormATS/formATS.model';
import { Observable } from 'rxjs';
import { ApiUrlService } from '../apiUrl/api-url.service';

@Injectable({
  providedIn: 'root'
})
export class FormATSService {

  private readonly API_URL: string;

  constructor(private http: HttpClient, private apiUrlService: ApiUrlService) {
    this.API_URL = this.apiUrlService.apiGetFormById();
  }

  getFormularioATS(id: string): Observable<FormATS> {
    return this.http.get<FormATS>(`${this.API_URL}/${id}`);
  }

}
