import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard  {

  constructor (public authService: AuthService,
    private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (!this.authService.isAuthenticated()) {
      swal.fire('RoleGuard ha detectado que no estás autenticado', 'Por favor, Sign In', 'warning');
      this.router.navigate(['/dashboard/login']);
      return false;
    }

    const role = next.data['role'];
    if (this.authService.hasRole(role)) {
      return true;
    }
    swal.fire('RoleGuard ha detectado que no tienes permisos', 'Acceso denegado', 'warning');
    // this.router.navigate(['/login']);
    return false;
  }

}
