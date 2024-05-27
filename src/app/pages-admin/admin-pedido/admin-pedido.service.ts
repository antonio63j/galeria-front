import { DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
// update angular 13 a 14 import { stringify } from '@angular/compiler/src/util';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { FiltroPedido } from 'src/app/shared/modelos/filtro-pedido';
import { Pedido } from 'src/app/shared/modelos/pedido';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminPedidoService implements OnDestroy {

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe
  ) {

  }

  getPedidos(filtroPedido: FiltroPedido): Observable<any> {

    let parametros = new HttpParams();
    // let encoder = new TextEncoder();
    let datePipeString: string;


    for (const key of Object.keys(filtroPedido)) {
      const valor = filtroPedido[key];
      if (valor != null) {
        if (valor instanceof Date) {
          // datePipeString = this.datePipe.transform(valor, 'yyyy-MM-dd HH:mm:ss zzzz');
          datePipeString = valor.toLocaleString();
          // const newstr = datePipeString.toString().replace('+', '%2B');
          parametros = parametros.append(key, datePipeString);
        }
        else {
          parametros = parametros.append(key, valor);
        }
      }
    }

    console.log(`parametros: ${JSON.stringify(parametros)}`);

    return this.http.get<Pedido[]>(environment.urlEndPoint + '/api/pedido/page',
      { params: parametros })
      .pipe(
        tap((response: any) => {
        })
      );
  }

  getPedido(id: string): Observable<any> {
    return this.http.get<Pedido>(`${environment.urlEndPoint}/api/pedido/${id}`).pipe(
      catchError(err => {
        console.error(`error lectura pedido: ${err.status} `);
        console.error(`error lectura pedido: ${err.message} `);
        return throwError(err);
      }));
  }

  save(pedido: Pedido): Observable<any> {
    return this.http.post<Pedido>(environment.urlEndPoint + '/api/pedido/save', pedido).pipe(
      catchError(err => {
        console.log(`error capturado: ${err.status} `);
        return throwError(err);
      }), map((response: any) => {
        return response;
      })
    );
  }

  ngOnDestroy(): void {

  }

}
