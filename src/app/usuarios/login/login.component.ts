import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
// import { routerTransition } from '../../router.animations';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Observable, Subject, Subscription } from 'rxjs';
import { map, takeUntil, tap, take } from 'rxjs/operators';
import Swal from 'sweetalert2';
import swal from 'sweetalert2';

import { ModalConModeloService } from '../../shared/services/modal-con-modelo.service';
import { ModalService } from '../../shared/services/modal.service';
import { AuthService } from '../auth.service';
import { Usuario } from '../../shared/modelos/usuario';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { Location } from '@angular/common';
import { PwdResetModalComponent } from './pwd-reset-modal/pwd-reset-modal.component';
import { SignupModalComponent } from '../signup/signup-modal/signup-modal.component';
import { Meta, Title } from '@angular/platform-browser';
import { CanonicalService } from 'src/app/shared/services/canonical.service';

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false,
  allowOutsideClick: false
});

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  // styleUrls: ['./login.component.scss'],
  // animations: [routerTransition()]
})

export class LoginComponent implements OnInit, OnDestroy {
  usuario: Usuario = new Usuario();
  titulo = 'inicio de sesión';
  private unsubscribe$ = new Subject<void>();

  constructor(
    private router: Router,
    private modalService: ModalService,
    private modalConModeloService: ModalConModeloService,
    public authService: AuthService,
    private location: Location,
    private titleService: Title,
    private metaTagService: Meta,
    private canonicalService: CanonicalService
    ) {
  }

  ngOnInit(): void {

    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
      // swal.fire('Aviso', `Ya estás autenticado! ${this.authService.usuario.username}`, 'info');
    } else {
      this.subscripcioneventoCerrarModalScrollable();
      this.crearModalLogin();
    }

    this.updateTitleAndMetaTags();

  }

  updateTitleAndMetaTags(): void{

    this.titleService.setTitle(`Pon tu cuenta de correo y contraseña para entrar en sesión`);
    // tslint:disable-next-line: max-line-length
    // this.metaTagService.updateTag({name: 'keywords', content: 'lote, obras, postres, primero, sugundo, arroces, pescados, pedidos, online, cocina, tradicional, calidad, buen precio'}, "name='keywords'");
    this.metaTagService.updateTag({name: 'description', content: `Entra en sesión con tu cuenta de correo y contraseña, \
para realizar pedidos online, es necesario entrar en sesión`}, `name='description'`);

    this.canonicalService.updateCanonicalUrl ();

  }

  crearModalLogin(): void {
    this.usuario.username = null;
    this.usuario.password = null;

    this.modalConModeloService.openModalScrollable(
      LoginModalComponent,
      { size: 'sm', backdrop: 'static', scrollable: true },
      this.usuario,
      'usuario',
      'Los campos con * son obligatorios',
      'Login'
    ).pipe(
      take(1) // take() manages unsubscription for us
    ).subscribe((result: any) => {
      if (result === 'resetPassword') {
        this.crearModalResetPassword();
      }
      if (result === 'signup') {
        this.crearModalSignup();
      }
    }
      , err => {
        console.log(err);
        swal.fire('Error cierre modal ', '', 'error');
      }
    );
  }

  crearModalResetPassword(): void {
    this.usuario.username = null;
    this.usuario.password = null;

    this.modalConModeloService.openModalScrollable(
      PwdResetModalComponent,
      { size: 'sm', backdrop: 'static', scrollable: true, animation: true },
      this.usuario,
      'usuario',
      'Los campos con * son obligatorios',
      'Login'
    ).pipe(
      take(1) // take() manages unsubscription for us
    ).subscribe(result => {
       console.log(result);
    }
      , err => {
        console.log(err);
        swal.fire('Error en gestión de cambio de contraseña', err.message, 'error');
      }
    );
  }

  crearModalSignup(): void {
    this.usuario.username = null;
    this.usuario.password = null;

    this.modalConModeloService.openModalScrollable(
      SignupModalComponent,
      { size: 'lg', backdrop: 'static', scrollable: true },
      this.usuario,
      'usuario',
      'Los campos con * son obligatorios',
      'Login'
    ).pipe(
      take(1) // take() manages unsubscription for us
    ).subscribe(result => {
      console.log({ confirmedResult: result });
    });
  }



  subscripcioneventoCerrarModalScrollable(): void {
    this.modalService.eventoCerrarModalScrollable.pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(
      (evento) => {
        console.log('recibido evento para cerrar modal:');
        this.modalConModeloService.closeModalScrollable();
        // this.location.back();
      },
      err => {
        console.log(err);
        swal.fire('Error gestion cierre modal', err.status, 'error');
    }
    );
  }

  ngOnDestroy(): void {
    console.log('realizando unsubscribes');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
