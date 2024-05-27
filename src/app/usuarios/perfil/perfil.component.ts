import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Direccion } from 'src/app/shared/modelos/direccion';
import { Usuario } from 'src/app/shared/modelos/usuario';
import { ModalConModeloService } from 'src/app/shared/services/modal-con-modelo.service';
import { AuthService } from '../auth.service';
import { DireccionFormComponent } from './direccion-form/direccion-form.component';
import { PerfilService } from './perfil.service';
import { isPlatformBrowser, Location } from '@angular/common';

import swal from 'sweetalert2';
import { ShowErrorService } from 'src/app/shared/services/show-error.service';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  usuario: Usuario;
  private direccionesTemp: Direccion[];
  public erroresValidacion: string[];
  private index: number;

  private observ$: Subscription = null;
  private observ1$: Subscription = null;
  private observ2$: Subscription = null;
  private unsubscribe$ = new Subject<void>();


  constructor(
    private modalConModeloService: ModalConModeloService,
    private authService: AuthService,
    private perfilService: PerfilService,
    private location: Location,
    private showErrorService: ShowErrorService,
    @Inject(PLATFORM_ID) private platformId: string

  ) {
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.usuario = this.authService.usuario;
      this.getUsuario(this.usuario.username);
    }
  }

  getUsuario(cuenta: string): void{
    this.observ$ = this.perfilService.getUsuario(cuenta).pipe(
      takeUntil(this.unsubscribe$)
    )
      .subscribe(
        json => {
          this.usuario = json;
          console.log(`json:${JSON.stringify(json)}`);
          if (this.usuario == null) {
            swal.fire('Error en acceso datos usuario', cuenta, 'error');
        }
        }
        , err => {
          if (err.status === 400) {
            console.log('error 400');
            this.erroresValidacion = err.error.errors as string[];
            console.log(this.erroresValidacion);
          } else {
              this.showErrorService.httpErrorResponse(err, 'Carga perfil usuario', err.error.mensaje, 'error');
          }
        }
      );
  }

  updateUsuario(usuario: Usuario): void{

    this.erroresValidacion = [];
    this.observ1$ = this.perfilService.updateUsuario(usuario).pipe(
      takeUntil(this.unsubscribe$)
    )
      .subscribe(
        json => {
          this.usuario = json.usuario;
          swal.fire('Perfil actualizado', '', 'success');
        }
        , err => {
          if (err.status === 400) {
            this.erroresValidacion = err.error.errors as string[];
            console.log(this.erroresValidacion);
          } else {
              this.showErrorService.httpErrorResponse(err, 'Actualización perfil', err.error.mensaje, 'error');
          }
        }
      );
  }

  updateDireccion(direccion: Direccion): void  {
    this.direccionesTemp = JSON.parse(JSON.stringify(this.usuario.direcciones));
    this.openModal(direccion);
  }

  eliminarDireccion(direccion: Direccion): void {
    let index: number;
    index = this.usuario.direcciones.findIndex(item => item === direccion);
    this.usuario.direcciones.splice(index, 1);
  }

  addDireccion(): void {

    this.direccionesTemp = JSON.parse(JSON.stringify(this.usuario.direcciones));
    const direccion: Direccion = new Direccion();
    this.index = this.usuario.direcciones.push(direccion);
    this.openModal(this.usuario.direcciones[this.index - 1]);

    console.log(`direccionesTemp=${JSON.stringify(this.direccionesTemp)}`);
  }

  update(usuario: Usuario): void {
    this.updateUsuario(usuario);
  }

  salir(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.location.back();
    }
  }

  public openModal(direccion: Direccion): void {
    this.modalConModeloService.openModalScrollable(
       DireccionFormComponent,
        { size: 'lg', backdrop: 'static', scrollable: true },
        direccion,
        'direccion',
        'Los campos con * son obligatorios',
        'Datos del direccion'
    ).pipe(
        take(1) // take() manages unsubscription for us
    ).subscribe((result: any) => {
        if (result === true) {
          this.usuario.direcciones = JSON.parse(JSON.stringify(this.direccionesTemp));
        }
    });
  }

}
