import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';

import swal from 'sweetalert2';

import { ModalService } from '../../shared/services/modal.service';
import { AdminLoteService } from '../../pages-admin/admin-lote/admin-lote.service';
import { environment } from '../../../environments/environment';
import { ModalConModeloService } from '../../shared/services/modal-con-modelo.service';
import { AuthService } from '../../usuarios/auth.service';
import { Lote } from 'src/app/shared/modelos/lote';
import { LoteDetalleComponent } from './lote-detalle/lote-detalle.component';
import { ShowErrorService } from 'src/app/shared/services/show-error.service';
import { Meta, Title } from '@angular/platform-browser';
import { Empresa } from 'src/app/shared/modelos/empresa';
import { ShareEmpresaService } from 'src/app/shared/services/share-empresa.service';
import { AdminTiposugerenciaService } from 'src/app/pages-admin/admin-tipoobra/admin-tipoobra.service';
import { EmpresaService } from 'src/app/pages-admin/empresa/empresa.service';
import { CanonicalService } from 'src/app/shared/services/canonical.service';

const swalWithBootstrapButtons = swal.mixin({
  customClass: {
    confirmButton: 'btn btn-primary',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false,
  allowOutsideClick: false
});

@Component({
  selector: 'app-lote',
  templateUrl: './lote.component.html',
  styleUrls: ['./lote.component.scss']
})
export class LoteComponent implements OnInit, OnDestroy{

  lotes: Lote[];
  lote: Lote = new Lote();

  private unsubscribe$ = new Subject<void>();
  private observ$: Subscription = null;

  host: string = environment.urlEndPoint;
  public lotevacio: Lote = new Lote();

  public empresa: Empresa;

  constructor(
    private loteService: AdminLoteService,
    private modalService: ModalService,
    private modalConModeloService: ModalConModeloService,
    public authService: AuthService,
    private router: Router,
    private showErrorService: ShowErrorService,
    private shareEmpresaService: ShareEmpresaService,
    private titleService: Title,
    private metaTagService: Meta,
    private tipoobraService: AdminTiposugerenciaService,
    private empresaService: EmpresaService,
    private canonicalService: CanonicalService

  ) {
    this.empresa = this.shareEmpresaService.copiaEmpresa();

  }

  ngOnInit(): void {
    this.subcripcionLotes();
  }

  cargaEmpresa(id: number): void {
    this.empresaService.get(id).pipe(
      takeUntil(this.unsubscribe$)
    )
      .subscribe({
        next: (json) => {
          console.info (`recepción en empresaService.get()`);
          this.empresa = json;
          this.updateTitleAndMetaTags()
        }
        ,
        error: (err) => this.showErrorService.httpErrorResponse(err, 'Error carga datos empresa', '', 'error')
        ,
        complete: () => console.info('complete empresaService.get()')
      });
  }

  subcripcionLotes(): void {
    this.loteService.getLotesVisibles().pipe(
      takeUntil(this.unsubscribe$),
      tap((response: any) => {
      }),
    ).subscribe({
        next: (response) => {  
          console.info ('recepcion en getLotesVisibles'); 
          this.lotes = (response as Lote[]);
          if (this.empresa === undefined) {
            this.cargaEmpresa(1);
          } else {
            this.updateTitleAndMetaTags();
          }
        }, 
        error: (err) => 
           this.showErrorService.httpErrorResponse(err, 'Error carga de lotes', '', 'error')
        ,
       complete: () => console.info('finalizada subscripción a getLotesVisibles')
      });
  }

  updateTitleAndMetaTags(): void{
    const lotes = Array.prototype.map.call(this.lotes, s => s.label).toString();

    this.titleService.setTitle(`${this.empresa.nombre} tu galeria en ${this.empresa.localidad} (${this.empresa.provincia}) te presenta sus lotes de obras`);
    // tslint:disable-next-line: max-line-length
    // this.metaTagService.updateTag({name: 'keywords', content: 'lote, obras, postres, primero, sugundo, arroces, pescados, pedidos, online, cocina, tradicional, calidad, buen precio'}, "name='keywords'");
    this.metaTagService.updateTag({name: 'description', content: `galeria en ${this.empresa.localidad} (${this.empresa.provincia}), \
opciones de nuestro lote de obras: ${lotes}, con varios primeros, segundos, y postres a elegir online y entrega a domicilio o venir a recoger`}, `name='description'`);

    this.canonicalService.updateCanonicalUrl ();

  }

  public comprar(lote: Lote): void {
     this.openModal(lote);
  }

  public salir(): void {
  }

  public create(): void {
    this.openModal(new Lote());
  }

  public update(lote: Lote): void {
    this.openModal(lote);
  }

  public openModal(lote: Lote): void {
    this.modalConModeloService.openModalScrollable(
      LoteDetalleComponent,
      { size: 'lg', backdrop: 'static', scrollable: true },
      lote,
      'lote',
      'Los campos con * son obligatorios',
      'Datos del lote'
    ).pipe(
      take(1) // take() manages unsubscription for us
    ).subscribe(result => {
      this.loteService.getLotes().pipe(take(1)).subscribe(respon => {
        this.lotes = respon as Lote[];
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
      lote => {
        console.log('recibido evento fin Upload');
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
