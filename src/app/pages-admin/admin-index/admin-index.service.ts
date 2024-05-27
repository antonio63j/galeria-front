import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AdminIndex } from '../../shared/modelos/admin-index';

@Injectable({
  providedIn: 'root'
})
export class AdminIndexService {

constructor(
  private http: HttpClient
) { }

getAdminIndex(): Observable<any> {
  return this.http
      .get<AdminIndex[]>(environment.urlEndPoint + '/api/adminindex')
      .pipe(
        catchError(err => {
            console.log('error capturado:');
            console.log(JSON.stringify(err));
            return throwError(err);
        })
    );
}
}
