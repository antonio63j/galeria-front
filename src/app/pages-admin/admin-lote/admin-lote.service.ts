import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ComponenteLote } from 'src/app/shared/modelos/componente-lote.enum';
import { Lote } from 'src/app/shared/modelos/lote';
import { LoteSugerencia } from 'src/app/shared/modelos/lote-sugerencia';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminLoteService implements OnDestroy {

  constructor(private http: HttpClient) {

  }

  getLote(id: number): Observable<any> {
    return this.http.get<Lote>(`${environment.urlEndPoint}/api/lote/${id}`).pipe(
      catchError(err => {
        console.error(`error lectura lote: ${err.status} `);
        console.error(`error lectura lote: ${err.message} `);
        return throwError(err);
      }));
  }

  getLotes(): Observable<any> {
    return this.http.get<Lote[]>(environment.urlEndPoint + '/api/lote/list').pipe(
      tap((response: any) => {
      }),
      map((response: any) => {
        (response as Lote[]).map(lote => {
          return lote;
        });
        return response;
      })
    );
  }

  getLotesVisibles(): Observable<any> {
    return this.http.get<Lote[]>(environment.urlEndPoint + '/api/lote/list-visible').pipe(
      tap((response: any) => {
        //  (response.content as lote[]).forEach (lote => console.log(lote));
      }),
      map((response: any) => {
        (response as Lote[]).map(lote => {
          return lote;
        });
        return response;
      })
    );
  }

  create(lote: Lote): Observable<any> {
    /* se añade el token con TokenInterceptor
    return this.http.post<any>(this.urlEndPoint, lote, { headers: this.httpHeader }); */
    lote.id = null;
    return this.http.post<Lote>(environment.urlEndPoint + '/api/lote/create', lote).pipe(
      catchError(err => {
        console.log(`error capturado en create: ${err.error.error} `);
        return throwError(err);
      })
    );
  }

  update(lote: Lote): Observable<any> {
    return this.http.put(environment.urlEndPoint + '/api/lote/update', lote).pipe(
      catchError(err => {
        console.log(`error al actualizar datos del lote: ${err.message} `);
        return throwError(err);
      })
      // , map((response: any) => response.lote as lote)
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete<Lote>(`${environment.urlEndPoint}/api/lote/${id}`).pipe(
      catchError(err => {
        console.error(`error al eliminar lote: ${err.status} `);
        console.error(`error al eliminar lote: ${err.message} `);
        return throwError(err);
      }));
  }

  addLoteSugerencia(
    lote: Lote,
    sugerenciaId: number,
    // primerPlato: boolean): Observable<any> {
    componenteLote: ComponenteLote): Observable<any> {
    const parametros = new HttpParams()
      .set('loteId', lote.id.toString())
      .set('sugerenciaId', sugerenciaId.toString())
      // .set('primerPlato', primerPlato.toString());
      .set('componenteLote', componenteLote);

    return this.http.post<any>(`${environment.urlEndPoint}/api/lotesugerencia/create`, lote, { params: parametros }).pipe(
        catchError(err => {
          console.error(`error al añadir lote-sugerencia: ${err.status} `);
          console.error(`error al añadir lote-sugerencia: ${err.message} `);
          return throwError(err);
        })
      );
  }

  deleteLoteSugerencia(id: number): Observable<any> {
    return this.http.delete<LoteSugerencia>(`${environment.urlEndPoint}/api/lotesugerencia/${id}`).pipe(
      catchError(err => {
        console.error(`error al eliminar lote-sugerencia: ${err.status} `);
        console.error(`error al eliminar lote-sugerencia: ${err.message} `);
        return throwError(err);
      })
    );
  }

  ngOnDestroy(): void {
    console.log('En ngOnDestroy ()');
  }
}

