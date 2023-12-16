import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private urlDiagnostico = 'https://diagnohealth-app.onrender.com/diagnosticar';
  private urlSintomas = 'https://diagnohealth-app.onrender.com/sintomas';

  constructor(private http: HttpClient) { }

  diagnosticar(sintomas: string[]) {

    const httpOptions = {
      headers: new HttpHeaders({
        'ngrok-skip-browser-warning': 'true' 
      })
    };
    // Este método hace la petición HTTP POST al backend
    return this.http.post(this.urlDiagnostico, { sintomas },httpOptions);
  }

  obtenerSintomas() {

    const httpOptions = {
      headers: new HttpHeaders({
        'ngrok-skip-browser-warning': 'true' 
      })
    };
    return this.http.get<any[]>(this.urlSintomas, httpOptions);
  }

  
}
