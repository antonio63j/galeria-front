import { AuthService } from '../auth.service';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import swal from 'sweetalert2';
import { Router } from '@angular/router';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(public authService: AuthService,
        private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
          catchError (e => {
            console.log(JSON.stringify(e));
            if (e.status == 401) {
                if (this.authService.isAuthenticated()) {
                    this.authService.logout();
                }
                swal.fire('AuthInterceptor ha detectado que no estás autenticado', 'por favor Sign In', 'warning');
                // this.router.navigate(['/login']);
            }
            if (e.status == 403) {
                swal.fire('AuthInterceptor ha detectado que no tienes permisos',
                          `${this.authService.usuario.username}, tu role es ${this.authService.usuario.roles}`, 'warning');
                /// this.router.navigate(['/clientes']);
            }
            return throwError (e);
          })
        );
    }
}
