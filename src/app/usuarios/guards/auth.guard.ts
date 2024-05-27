import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(public authService: AuthService,
    private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isAuthenticated()) {
      if (this.isTokenExpirado()) {
        swal.fire('AuthGuard ha detectado que el token ha expiradono', 'Por favor, Sign In', 'warning');
        this.authService.logout();
        // this.router.navigate (['/login']);
        return false;
      }
      return true;
    }
    swal.fire('AuthGuard ha detectado que no estás autenticado', 'Por favor, Sign In', 'warning');
    // this.router.navigate (['/login']);
    return false;
  }

  public isTokenExpirado(): boolean {
    const token = this.authService.token;
    const payload = this.authService.obtenerDatosToken(token);
    const now = new Date().getTime() / 1000;
    if (now > payload.exp) {
       return true;
    }
    return false;
  }

}
