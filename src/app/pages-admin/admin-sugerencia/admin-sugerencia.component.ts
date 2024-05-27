import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { routerTransition } from '../../router.animations';
import { Subject, Subscription } from 'rxjs';
import { map, takeUntil, tap, take } from 'rxjs/operators';
import Swal from 'sweetalert2';
import swal from 'sweetalert2';

import { Sugerencia } from '../../shared/modelos/sugerencia';

import { AdminSugerenciaService } from './admin-sugerencia.service';
import { ModalConModeloService } from '../../shared/services/modal-con-modelo.service';
import { ModalService } from '../../shared/services/modal.service';
// import { SugerenciaFormComponent } from './sugerencia-form/sugerencia-form.component';

import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../usuarios/auth.service';
import { SugerenciaFormComponent } from './sugerencia-form/sugerencia-form.component';
import { environment } from 'src/environments/environment';
import { Tiposugerencia } from 'src/app/shared/modelos/tiposugerencia';
import { ShareEmpresaService } from 'src/app/shared/services/share-empresa.service';
import { FiltroSugerencia } from 'src/app/shared/modelos/filtro-sugerencia';
import { HttpParams } from '@angular/common/http';
import { ShowErrorService } from 'src/app/shared/services/show-error.service';
import { isPlatformBrowser } from '@angular/common';

const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false,
    allowOutsideClick: false
});

@Component({
    selector: 'app-sugerencias',
    templateUrl: './admin-sugerencia.component.html',
    styleUrls: ['./admin-sugerencia.component.scss'],
    animations: [routerTransition()],
    // providers: [SugerenciasService]
})

export class AdminSugerenciaComponent implements OnInit, OnDestroy {
    sugerencias: Sugerencia[];
    sugerencia: Sugerencia = new Sugerencia();
    // private pagina: number;
    host: string = environment.urlEndPoint;
    private unsubscribe$ = new Subject<void>();
    public paginador: any;

    public tipoObras: Tiposugerencia[];

    public filterChecked = false;
    public filtroSugerencia: FiltroSugerencia = new FiltroSugerencia();

    public disable = true;

    constructor(
        private sugerenciaService: AdminSugerenciaService,
        private shareEmpresaService: ShareEmpresaService,
        private modalConModeloService: ModalConModeloService,
        private modalService: ModalService,
        private translate: TranslateService,
        private authService: AuthService,
        private showErrorService: ShowErrorService,
        @Inject(PLATFORM_ID) private platformId: string
    ) {
        this.sugerencias = [];
        this.tipoObras = this.shareEmpresaService.getIipoobrasInMem();

    }

    ngOnInit(): void {
        this.nuevaPagina(0);
        this.subscripcioneventoCerrarModalScrollable();
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

        // test
        if (!this.filterChecked) {
            this.filtroSugerencia.init();
        }
        // test

        this.sugerenciaService
            .getSugerencias(this.filtroSugerencia)
            .pipe(
                takeUntil(this.unsubscribe$),
                tap((response: any) => {
                    // console.log(response);
                })
                // ,
                // map((response: any) => {
                //     (response.content as Sugerencia[]).map(sugerencia => {
                //         sugerencia.label = sugerencia.label.toUpperCase();
                //         return sugerencia;
                //     });
                //     return response;
                // })
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

    crear(): void {
        const sugerencia: Sugerencia = new Sugerencia();
        sugerencia.visible = 'si';
        this.openModal(sugerencia);
    }

    update(sugerencia: Sugerencia): void {
        this.openModal(sugerencia);
    }

    public openModal(sugerencia: Sugerencia): void {
        this.modalConModeloService.openModalScrollable(
            SugerenciaFormComponent,
            { size: 'lg', backdrop: 'static', scrollable: true },
            sugerencia,
            'sugerencia',
            'Los campos con * son obligatorios',
            'Datos del sugerencia'
        ).pipe(
            take(1) // take() manages unsubscription for us
        ).subscribe(result => {
            this.sugerenciaService.getSugerencias(this.filtroSugerencia).subscribe(respon => {
                this.sugerencias = respon.content as Sugerencia[];
                this.paginador = respon;
            });
        });
    }

    delete(sugerencia: Sugerencia): void {
        swalWithBootstrapButtons.fire({
            title: '¿Estás seguro?',
            text: `Eliminarás el sugerencia ${sugerencia.label}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar!',
            cancelButtonText: 'No, cancelar!',
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                this.sugerenciaService.delete(sugerencia).subscribe(
                    response => {
                        if (this.paginador.numberOfElements === 1) {
                            // this.pagina = 0;
                            this.filtroSugerencia.page = '0';
                        }
                        this.sugerenciaService.getSugerencias(this.filtroSugerencia).subscribe(respon => {
                            this.sugerencias = respon.content as Sugerencia[];
                            this.paginador = respon;
                        });
                        swalWithBootstrapButtons.fire(
                            `Eliminada sugerencia ${sugerencia.label}!`,
                            '',
                            'success'
                        );
                    }
                    , err => {this.showErrorService.httpErrorResponse(err, 'Error eliminando sugerencia', '', 'error');
                    }
                );
            }
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
            sugerencia => {
                console.log('recibido evento fin Upload');
                this.sugerencias.map(sugerenciaOriginal => {
                    if (sugerenciaOriginal.id === sugerencia.id) {
                        sugerenciaOriginal.imgFileName = sugerencia.imgFileName;
                    }
                    return sugerenciaOriginal;
                }); // map
            }
        );
    }

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

    ngOnDestroy(): void {
        console.log('realizando unsubscribes');
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
