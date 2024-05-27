import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../../shared/services/modal.service';
import { AuthService } from '../../auth.service';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Usuario } from '../../../shared/modelos/usuario';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import swal from 'sweetalert2';
import { ShowErrorService } from 'src/app/shared/services/show-error.service';


@Component({
  selector: 'app-pwd-reset-modal',
  templateUrl: './pwd-reset-modal.component.html',
  styleUrls: ['./pwd-reset-modal.component.scss']
})
export class PwdResetModalComponent implements OnInit, OnDestroy {
  public codigoEnviado = false;
  public usuario: Usuario = new Usuario();
  public hide = true;
  public password2 = '';
  private observ$: Subscription = null;
  private unsubscribe$ = new Subject<void>();

  constructor(
    public authService: AuthService,
    public activeModal: NgbActiveModal,
    public showErrorService: ShowErrorService,
    private modalService: ModalService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
  }

  enviarEmail(): void {
    this.observ$ = this.authService.resetPwd(this.usuario).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(
      response => {
        this.codigoEnviado = true;
        // this.modalService.eventoCerrarModalScrollable.emit();
        swal.fire('Reset contraseña de usuario: ', 'Se envió un email con un codigo que le permitirá cambiar la contraseña, no olvide revisar la bandeja de spam', 'success');
      },
      err => {this.showErrorService.httpErrorResponse(err, 'Gestión envio email para cambio de contraseña', err.error.mensaje, 'error');
      }
    );
    return;
  }

  actualizarPwd(): void {
    this.observ$ = this.authService.actualizarPwd(this.usuario).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(
      response => {
        // this.modalService.eventoCerrarModalScrollable.emit();
        this.activeModal.close(true);
      },
      err => {this.showErrorService.httpErrorResponse(err, 'Gestión cambio contraseña', err.error.mensaje, 'error');}
     );
    return;
  }
  ngOnDestroy(): void {
    console.log('realizando unsubscribes');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


}
