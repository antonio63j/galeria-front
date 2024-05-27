import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EmailContactoCliente } from 'src/app/shared/modelos/mensajes/email-contacto-cliente';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  constructor(
    private http: HttpClient
  ) { }



  public emailCliente(emailContactoCliente: EmailContactoCliente): Observable<any> {
    return this.http.post<EmailContactoCliente>(environment.urlEndPoint + '/api/usuario/emailCliente', emailContactoCliente)
      .pipe(
        catchError(err => {
          console.log('error capturado ' + JSON.stringify(err));
          return throwError(err);
        })
      );
  }
}