import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Tiposugerencia } from '../../shared/modelos/tiposugerencia';

@Injectable({
  providedIn: 'root'
})
export class AdminTiposugerenciaService implements OnDestroy {

  constructor(private http: HttpClient,
    //  public authService: AuthService
  ) { }

  getTiposugerencias(): Observable<any> {
    return this.http.get<Tiposugerencia[]>(environment.urlEndPoint + '/api/tipoobra/list').pipe(
      tap((response: any) => {
      }),
      map((response: any) => {
        (response as Tiposugerencia[]).map(sli => {
          return sli;
        });
        return response;
      })
    );
  }

  create(tipoobra: Tiposugerencia): Observable<any> {
    /* se añade el token con TokenInterceptor
    return this.http.post<any>(this.urlEndPoint, tipoobra, { headers: this.httpHeader }); */
    tipoobra.id = null;
    return this.http.post<Tiposugerencia>(environment.urlEndPoint + '/api/tipoobra/create', tipoobra).pipe(
      catchError(err => {
        console.log(`error capturado en create tipoobra: ${err.error.error} `);
        return throwError(err);
      })
    );
  }

  update(tipoobra: Tiposugerencia): Observable<any> {
    return this.http.put(environment.urlEndPoint + '/api/tipoobra/update', tipoobra).pipe(
      catchError(err => {
        console.log(`error al actualizar datos del tipoobra: ${err.message} `);
        return throwError(err);
      })
      // , map((response: any) => response.tipoobra as tipoobra)
    );
  }

  delete(id: number): Observable<Tiposugerencia> {
    return this.http.delete<Tiposugerencia>(`${environment.urlEndPoint}/api/tipoobra/${id}`).pipe(
      catchError(err => {
        console.error(`error al eliminar el tipo de obra: ${err.status} `);
        console.error(`error al eliminar el tipo de obra: ${err.message} `);
        return throwError(err);
      }));
  }

  ngOnDestroy(): void {
    console.log('Tiposugerenciaservice.ngOnDestroy ()');
  }
}
