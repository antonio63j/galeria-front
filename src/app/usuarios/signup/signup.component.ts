import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { CanonicalService } from 'src/app/shared/services/canonical.service';
import { Usuario } from '../../shared/modelos/usuario';
import { ModalConModeloService } from '../../shared/services/modal-con-modelo.service';
import { ModalService } from '../../shared/services/modal.service';
import { AuthService } from '../auth.service';
import { SignupModalComponent } from './signup-modal/signup-modal.component';
// import { Location } from '@angular/common';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  // styleUrls: ['./signup.component.scss'],
  // animations: [routerTransition()]
})
export class SignupComponent implements OnInit, OnDestroy {
  usuario: Usuario = new Usuario();
  private unsubscribe$ = new Subject<void>();

  constructor(
    private router: Router,
    private modalService: ModalService,
    private modalConModeloService: ModalConModeloService,
    public authService: AuthService,
    private titleService: Title,
    private metaTagService: Meta,
    private canonicalService: CanonicalService
  ) { }

  ngOnInit(): void {

    this.subscripcioneventoCerrarModalScrollable();
    this.crearModal();
    this.updateTitleAndMetaTags();

  }

  updateTitleAndMetaTags(): void {

    this.titleService.setTitle(`Registro de nuevos usuarios`);
    // tslint:disable-next-line: max-line-length
    // this.metaTagService.updateTag({name: 'keywords', content: 'lote, obras, postres, primero, sugundo, arroces, pescados, pedidos, online, cocina, tradicional, calidad, buen precio'}, "name='keywords'");
    this.metaTagService.updateTag({
      name: 'description', content: `Desde aquí los usuarios podrán registrarse en la web \
para realizar pedidos online es necesario registrarse`}, `name='description'`);
    this.canonicalService.updateCanonicalUrl();
  }

  crearModal(): void {
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
    });
  }

  subscripcioneventoCerrarModalScrollable(): void {
    this.modalService.eventoCerrarModalScrollable.pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(
      () => {
        console.log('recibido evento para cerrar modal');
        this.modalConModeloService.closeModalScrollable();
      }
    );
  }

  ngOnDestroy(): void {
    console.log('realizando unsubscribes');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}


