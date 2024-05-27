import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { isPlatformBrowser, Location } from '@angular/common';
import { FiltroSugerencia, OrdenLoteSugerencia } from 'src/app/shared/modelos/filtro-sugerencia';
import { Lote } from 'src/app/shared/modelos/lote';
import { LoteSugerencia } from 'src/app/shared/modelos/lote-sugerencia';
import { Sugerencia } from 'src/app/shared/modelos/sugerencia';
import { Tiposugerencia } from 'src/app/shared/modelos/tiposugerencia';
import { AuthService } from 'src/app/usuarios/auth.service';
import { environment } from 'src/environments/environment';
import { LowerCasePipe } from '@angular/common';
import Swal from 'sweetalert2';
import swal from 'sweetalert2';

import { AdminLoteService } from '../admin-lote/admin-lote.service';
import { AdminSugerenciaService } from '../admin-sugerencia/admin-sugerencia.service';
import { ShareEmpresaService } from 'src/app/shared/services/share-empresa.service';
import { ComponenteLote } from 'src/app/shared/modelos/componente-lote.enum';
import { ShowErrorService } from 'src/app/shared/services/show-error.service';

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false,
  allowOutsideClick: false
});

@Component({
  selector: 'app-admin-lote-sugerencia',
  templateUrl: './admin-lote-sugerencia.component.html',
  styleUrls: ['./admin-lote-sugerencia.component.scss']
})

export class AdminLoteSugerenciaComponent implements OnInit, OnDestroy {

  private subscriptionParams$: Subscription = null;
  private unsubscribe$ = new Subject<void>();

  host: string = environment.urlEndPoint;

  // atributos para tabla de lote
  public ordenLoteSugerencia: OrdenLoteSugerencia = new OrdenLoteSugerencia();
  public lote: Lote;

  public disableMS = false;
  public invisibleMS = false;

  // atributos para tabla de configuracion de lote
  public paginador: any;
  sugerencias: Sugerencia[];
  sugerencia: Sugerencia = new Sugerencia();
  public tipoObras: Tiposugerencia[];

  public disable = false;

  // public componenteLote: string;
  public componenteLote: ComponenteLote;

  public filterChecked = false;
  public filtroSugerencia: FiltroSugerencia = new FiltroSugerencia();

  constructor(
    private location: Location,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private loteService: AdminLoteService,
    private sugerenciaService: AdminSugerenciaService,
    private shareEmpresaService: ShareEmpresaService,
    private showErrorService: ShowErrorService,
    @Inject(PLATFORM_ID) private platformId: string


  ) {
    this.tipoObras = this.shareEmpresaService.getIipoobrasInMem();

    this.componenteLote = ComponenteLote.primero;
  }

  ngOnInit(): void {
    this.subscripcionGestionParams();
  }

  changedGrupoIndivisible (): void {

  }

  subscripcionGestionParams(): void {
    this.subscriptionParams$ = this.activatedRoute.params
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(params => this.gestionParams(params));
  }

  gestionParams(params: any): void {
    const loteId = params.id;
    this.getLote(loteId);
  }

  // procedimientos para tabla del lote
  // +++++++++++++++++++++++++++++++++++++++++++++
  getLote(loteId: number): void {
    this.loteService.getLote(loteId)
      .pipe(
        takeUntil(this.unsubscribe$),
        tap((response: any) => {
          // console.log(response);
        })
      )
      .subscribe(
        response => {
          this.lote = response.data as Lote;
        },
        err => {this.showErrorService.httpErrorResponse(err, 'Error en carga sugerencias', '', 'error');
        }
      );
  }

  public configurarLote(componenteLote: ComponenteLote): void {
    // tabla lote pasa a invisible
    // tabla configuracion lote pasa a visible
    // carga de tabla lote configuracion
    this.disableMS = true;
    this.disable = false;
    this.componenteLote = componenteLote;
    this.inicioSeleccionSugerencias();

  }

  public deleteLoteSugerencia(loteSugerencia: LoteSugerencia): void {
    swalWithBootstrapButtons.fire({
      title: '¿Estás seguro?',
      text: `Eliminarás la sugerencia ${loteSugerencia.sugerencia.label}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.loteService.deleteLoteSugerencia(loteSugerencia.id).subscribe(
          response => {
            this.getLote(this.lote.id);
          }
          , err => {this.showErrorService.httpErrorResponse(err, 'Error eliminando lote-sugerencia', '', 'error');
          }
        );
      }
    });
  }


  public salir(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.location.back();
    }
  }

  public sortChangeColumnMS(colName: string): void {
    if (colName === this.ordenLoteSugerencia.order) {
      if (this.ordenLoteSugerencia.direction === 'asc') {
        this.ordenLoteSugerencia.direction = 'desc';
      }
      else {
        this.ordenLoteSugerencia.direction = 'asc';
      }
    } else {
      this.ordenLoteSugerencia.order = colName;
      this.ordenLoteSugerencia.direction = 'asc';
    }
    this.sortColumnMS();
  }

  sortColumnMS(): void {


    if (this.ordenLoteSugerencia.order === 'label') {
      if (this.ordenLoteSugerencia.direction === 'asc') {
        this.lote.loteSugerencias.sort((a, b) =>
          (a.sugerencia.label > b.sugerencia.label) ? 1 : -1);
      } else {
        this.lote.loteSugerencias.sort((a, b) =>
          (a.sugerencia.label < b.sugerencia.label) ? 1 : -1);
      }
    } else {
      if (this.ordenLoteSugerencia.direction === 'asc') {
        this.lote.loteSugerencias.sort((a, b) =>
          (a.componenteLote > b.componenteLote) ? 1 : -1);
      } else {
        this.lote.loteSugerencias.sort((a, b) =>
          (a.componenteLote < b.componenteLote) ? 1 : -1);
      }
    }

  }


  // procedimientos para tabla configuracion lotes
  // +++++++++++++++++++++++++++++++++++++++++++++
  changedFilter(): void {
    if (this.filterChecked) {
      this.nuevaPagina(0);
    } else {
      this.filtroSugerencia.init();
      this.nuevaPagina(0);
    }
  }

  quitarFiltros(): void {
    this.filtroSugerencia.init();
    this.filterChecked = !this.filterChecked;
    this.nuevaPagina(0);
  }

  inicioSeleccionSugerencias(): void {
    this.sugerencias = [];
    this.filtroSugerencia.init();
    this.filterChecked = false;
    this.nuevaPagina(0);
  }

  public sortChangeColumn(colName: string): void {
    if (colName === this.filtroSugerencia.order) {
      if (this.filtroSugerencia.direction === 'asc') {
        this.filtroSugerencia.direction = 'desc';
      }
      else {
        this.filtroSugerencia.direction = 'asc';
      }
    } else {
      this.filtroSugerencia.order = colName;
      this.filtroSugerencia.direction = 'asc';
    }
    this.nuevaPagina(0);
  }

  // Es llamado por el paginator
  public getPagina(paginaYSize: any): void {
    const pagina: number = paginaYSize.pagina;
    const size: number = paginaYSize.size;
    this.filtroSugerencia.size = size.toString();
    this.nuevaPagina(pagina);
  }

  nuevaPagina(pagina: number): void {
    this.filtroSugerencia.page = pagina.toString();

    if (!this.filterChecked) {
      this.filtroSugerencia.init();
    }

    this.sugerenciaService
      .getSugerencias(this.filtroSugerencia)
      .pipe(
        takeUntil(this.unsubscribe$),
        tap((response: any) => {
          // console.log(response);
        })
      )
      .subscribe(
        response => {
          this.sugerencias = response.content as Sugerencia[];
          this.paginador = response;
          if (isPlatformBrowser(this.platformId)) {
            window.scrollTo(0, 0);
          }
        },
        err => {this.showErrorService.httpErrorResponse(err, 'Error carga sugerencias', '', 'error');
        }
      );
  }

  public addLoteSugerencia(sugerencia: Sugerencia): void {

    if (sugerencia.visible === 'no') {
      swal.fire('La sugerencia está configurada a "no visible"', '', 'warning');
      return;
    }
    this.loteService.addLoteSugerencia(
      // this.lote, sugerencia.id, primerPlato)
      this.lote, sugerencia.id, this.componenteLote)

      .pipe(
        takeUntil(this.unsubscribe$),
        tap((response: any) => {
          // console.log(response);
        })
      )
      .subscribe(
        response => {
          this.lote = response.data as Lote;
          this.sortColumnMS();
        },
        err => {this.showErrorService.httpErrorResponse(err, 'Error al añadir la obra, posiblemente este en otro lote, ', '', 'error');
        }
      );
  }

  salirSeleccion(): void {
    this.disable = true;
    this.disableMS = false;
  }

  // procedimientos comunes
  // +++++++++++++++++++++++++++++++++++++++++++++

  ngOnDestroy(): void {
    console.log('realizando unsubscribes');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

  }

}
