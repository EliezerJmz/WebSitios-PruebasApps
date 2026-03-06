import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormATS } from '../../api/FormATS/formATS.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormATSService {

   private apiUrl = 'http://localhost:8080/api/v1/formularios';

  constructor(private http: HttpClient) { }

  getFormularioATS(id: string): Observable<FormATS> {
    return this.http.get<FormATS>(`${this.apiUrl}/${id}`);
  }

}
