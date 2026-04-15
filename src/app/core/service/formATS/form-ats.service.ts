import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormATS } from '../../api/FormATS/formATS.model';
import { Observable } from 'rxjs';
import { ApiUrlService } from '../apiUrl/api-url.service';
import { AnswersATS } from '../../api/FormATS/answersATS.model';

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

  submitFormAnswersATS(formularioId: string, answers: any, metadata: any, userId: string): Observable<AnswersATS> {
    const URL = this.apiUrlService.apiSubmitAnswersATS(formularioId);
    const payload = {
      answers,
      metadata: {
        ...metadata,
        usuarioId: userId
      }
    };
    return this.http.post<AnswersATS>(URL, payload);
  }

}
