import { Component, OnDestroy, OnInit} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';

import swal from 'sweetalert2';

import { ModalService } from '../../shared/services/modal.service';
import { AdminLoteService } from './admin-lote.service';
import { environment } from '../../../environments/environment';
import { ModalConModeloService } from '../../shared/services/modal-con-modelo.service';
import { AuthService } from '../../usuarios/auth.service';
import { Lote } from 'src/app/shared/modelos/lote';
import { LoteFormComponent } from './lote-form/lote-form.component';
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
  selector: 'app-admin-lote',
  templateUrl: './admin-lote.component.html',
  styleUrls: ['./admin-lote.component.scss']
})
export class AdminLoteComponent implements OnInit, OnDestroy{

  lotes: Lote[];
  lote: Lote = new Lote();

  private unsubscribe$ = new Subject<void>();
  private observ$: Subscription = null;

  host: string = environment.urlEndPoint;
  public lotevacio: Lote = new Lote();

  constructor(
    private loteService: AdminLoteService,
    private modalService: ModalService,
    private modalConModeloService: ModalConModeloService,
    public authService: AuthService,
    private showErrorService: ShowErrorService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.subcripcionLotes();
  }

  subcripcionLotes(): void {
    this.loteService.getLotes().pipe(
      takeUntil(this.unsubscribe$),
      tap((response: any) => {
      }),
    ).subscribe(
      response => {
        this.lotes = (response as Lote[]);
        // this.paginador = response;
      }
      , err => this.showErrorService.httpErrorResponse(err, 'Carga lotes', '', 'error')

    );
  }

  public create(): void {
    const lote: Lote = new Lote();
    lote.visible = true;
    this.openModal(lote);
  }

  public delete(lote: Lote): void {
    swalWithBootstrapButtons.fire({
      title: '¿Estás seguro?',
      text: `Eliminarás el lote: ${lote.label}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.loteService.delete(lote.id).subscribe(
          response => {
            this.loteService.getLotes().subscribe(respon => {
              this.lotes = (respon as Lote[]);
            });
          }
          , err => this.showErrorService.httpErrorResponse(err, 'Error eliminando lote', '', 'error')
        );
      }
    });

  }

  public update(lote: Lote): void {
    this.openModal(lote);
  }

  public openModal(lote: Lote): void {
    this.modalConModeloService.openModalScrollable(
      LoteFormComponent,
      { size: 'lg', backdrop: 'static', scrollable: true },
      lote,
      'lote',
      'Los campos con * son obligatorios',
      'Datos del lote'
    ).pipe(
      take(1) // take() manages unsubscription for us
    ).subscribe(result => {
      this.loteService.getLotes().subscribe(respon => {
        this.lotes = respon as Lote[];
      });
    });
  }

  composicion(lote: Lote): void {

  }

  subscripcioneventoCerrarModalScrollable(): void {
    this.modalService.eventoCerrarModalScrollable.pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(
      () => {
        // console.log('recibido evento para cerrar modal');
        this.modalConModeloService.closeModalScrollable();
      }
    );
  }

  subscripcioneventoNotificacionUpload(): void {
    this.modalService.eventoNotificacionUpload.pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(
      lote => {
        // console.log('recibido evento fin Upload');
        this.lotes.map(loteOriginal => {
          if (loteOriginal.id === lote.id) {
            loteOriginal.imgFileName = lote.imgFileName;
          }
          return loteOriginal;
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
