import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';

import swal from 'sweetalert2';

import { Tiposugerencia } from '../../shared/modelos/tiposugerencia';
import { ModalService } from '../../shared/services/modal.service';
import { AdminTiposugerenciaService } from './admin-tipoobra.service';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConModeloService } from '../../shared/services/modal-con-modelo.service';
import { AuthService } from 'src/app/usuarios/auth.service';
import { Router } from '@angular/router';
import { TiposugerenciaFormComponent } from './tipoobra-form/tipoobra-form.component';
import { ShowErrorService } from 'src/app/shared/services/show-error.service';

const swalWithBootstrapButtons = swal.mixin({
  customClass: {
    confirmButton: 'btn btn-primary',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false,
  allowOutsideClick: false
});

@Component({
  selector: 'app-admin-tipoobra',
  templateUrl: './admin-tipoobra.component.html',
  styleUrls: ['./admin-tipoobra.component.scss']
})

export class AdminTiposugerenciaComponent implements OnInit, OnDestroy {

  tipoobras: Tiposugerencia[];
  tipoobra: Tiposugerencia = new Tiposugerencia();

  private unsubscribe$ = new Subject<void>();
  private observ$: Subscription = null;

  public tituloBody: string;
  host: string = environment.urlEndPoint;
  public tipoobravacio: Tiposugerencia = new Tiposugerencia();

  constructor(
    private tipoobraService: AdminTiposugerenciaService,
    private modalService: ModalService,
    private modalConModeloService: ModalConModeloService,
    public authService: AuthService,
    private router: Router,
    private showErrorService: ShowErrorService
  ) {
  }

  ngOnInit(): void {
    this.subcripcionTiposugerencias();
  }

  subcripcionTiposugerencias(): void {
    this.tipoobraService.getTiposugerencias().pipe(
      takeUntil(this.unsubscribe$),
      tap((response: any) => {
      }),
    ).subscribe(
      response => {
        this.tipoobras = (response as Tiposugerencia[]);
      }
      , err => {this.showErrorService.httpErrorResponse(err, 'Error carga tipo de obra', '', 'error');
      }
    );
  }

  public create(): void {
    this.openModal(new Tiposugerencia());
  }

  public delete(tipoobra: Tiposugerencia): void {
    swalWithBootstrapButtons.fire({
      title: '¿Estás seguro?',
      text: `Eliminarás el grupo de obras: ${tipoobra.label}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.tipoobraService.delete(tipoobra.id).subscribe(
          response => {
            this.tipoobraService.getTiposugerencias().subscribe(respon => {
              this.tipoobras = (respon as Tiposugerencia[]);
            });
          }
          , err => {this.showErrorService.httpErrorResponse(err, 'Error eliminando tipo-obra', '', 'error');
          }
        );
      }
    });

  }

  public update(tipoobra: Tiposugerencia): void {
    this.openModal(tipoobra);
  }

  public openModal(tipoobra: Tiposugerencia): void {

    this.modalConModeloService.openModalScrollable(
      TiposugerenciaFormComponent,
      { size: 'lg', backdrop: 'static', scrollable: true },
      tipoobra,
      'tipoobra',
      'Los campos con * son obligatorios',
      'Clasificación de obras'
    ).pipe(
      take(1) // take() manages unsubscription for us
    ).subscribe(result => {
      this.tipoobraService.getTiposugerencias().subscribe(respon => {
        this.tipoobras = respon as Tiposugerencia[];
      });
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

  subscripcioneventoNotificacionUpload(): void {
    this.modalService.eventoNotificacionUpload.pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(
      tipoobra => {
        console.log('recibido evento fin Upload');
        this.tipoobras.map(tipoobraOriginal => {
          if (tipoobraOriginal.id === tipoobra.id) {
            tipoobraOriginal.imgFileName = tipoobra.imgFileName;
          }
          return tipoobraOriginal;
        }); // map
      }
    );
  }


  ngOnDestroy(): void {
    console.log('ngOnDestroy (), realizando unsubscribes');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
