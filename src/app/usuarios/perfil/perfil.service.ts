import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Usuario } from 'src/app/shared/modelos/usuario';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  constructor(
    private http: HttpClient
  ) {

  }

  getUsuario(cuenta: string): Observable<any> {
    const parametros = new HttpParams()
      .set('cuenta', cuenta);
    return this.http.get<Usuario>(environment.urlEndPoint + '/api/usuario', { params: parametros })
      .pipe(
        tap((response: any) => {

        })
      );
  }

  updateUsuario(usuario: Usuario): Observable<any> {
    return this.http.put<Usuario>(environment.urlEndPoint + '/api/usuario/update', usuario)
      .pipe(
        catchError(err => {
          console.log('error capturado ' + JSON.stringify(err));
          return throwError(err);
        })
      );
  }
}
