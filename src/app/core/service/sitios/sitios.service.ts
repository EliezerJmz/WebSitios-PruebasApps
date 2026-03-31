import { Injectable } from '@angular/core';
import { ApiUrlService } from '../apiUrl/api-url.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sitios } from '../../api/sitios/sitiios.model';

@Injectable({
  providedIn: 'root'
})
export class SitiosService {

  private sitiosById: string;

  constructor(private http: HttpClient, private apiUrlService: ApiUrlService) { 
    this.sitiosById = this.apiUrlService.apiGetSitioById();
  }


  getSitioById(id: string): Observable<Sitios> {
    const url = `${this.sitiosById}/${id}`;
    return this.http.get<Sitios>(url);
  }
}
