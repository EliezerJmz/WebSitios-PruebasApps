import { Injectable } from '@angular/core';
import { ApiUrlService } from '../apiUrl/api-url.service';
import { Observable } from 'rxjs';
import { PublishedForms } from '../../api/PublishedForms/PublishedForms.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PublishedFormsService {

    private readonly API_URL: string;

  constructor(private http: HttpClient,  apiUrlService: ApiUrlService) { 
    this.API_URL = apiUrlService.apiPublishedForms();
  }

  getPublishedForms(param: string): Observable<PublishedForms> {
    return this.http.get<PublishedForms>(`${this.API_URL}?param=${param}`);
  }
}

