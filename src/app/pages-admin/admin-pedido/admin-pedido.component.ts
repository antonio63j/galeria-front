import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';
import { AdminSugerenciaService } from 'src/app/pages-admin/admin-sugerencia/admin-sugerencia.service';
import { DynamicFormComponent } from 'src/app/shared/componentes/filtro/dynamic-form/dynamic-form.component';
import { FieldConfig, OpcionesSelect } from 'src/app/shared/componentes/filtro/field.interface';
import { Validators } from '@angular/forms';
import { FiltroPedido } from 'src/app/shared/modelos/filtro-pedido';
import { ModalConModeloService } from 'src/app/shared/services/modal-con-modelo.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { AuthService } from 'src/app/usuarios/auth.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import swal from 'sweetalert2';
import { EntregaPedidoEnum, EstadoPedidoEnum, Pedido } from 'src/app/shared/modelos/pedido';
import localeEs from '@angular/common/locales/es';
import { isPlatformBrowser, registerLocaleData } from '@angular/common';
import { AdminPedidoService } from './admin-pedido.service';
import { ShowErrorService } from 'src/app/shared/services/show-error.service';

registerLocaleData(localeEs, 'es');


const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false,
    allowOutsideClick: false
});



@Component({
    selector: 'app-admin-pedido',
    templateUrl: './admin-pedido.component.html',
    styleUrls: ['./admin-pedido.component.scss']
})

export class AdminPedidoComponent implements OnInit, OnDestroy {

    @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

    pedidos: Pedido[];
    pedido: Pedido = new Pedido();


    host: string = environment.urlEndPoint;
    private unsubscribe$ = new Subject<void>();
    public paginador: any;

    public filterChecked = false;
    public filtroPedido: FiltroPedido = new FiltroPedido();

    public disable = true;

    regConfig: FieldConfig[];

    public opcionesOrdenacion: OpcionesSelect[];
    public sentidoOrdenacion: OpcionesSelect[];
    public opcionesEstado: OpcionesSelect[];
    public opcionesEntrega: OpcionesSelect[];

    constructor(
        private pedidoService: AdminPedidoService,
        private modalConModeloService: ModalConModeloService,
        private modalService: ModalService,
        private showErrorService: ShowErrorService,
        private translate: TranslateService,
        private authService: AuthService,
        @Inject(PLATFORM_ID) private platformId: string

    ) {
        this.filtroPedido.init();

        this.opcionesEstado = [{ value: null, viewValue: 'sin filtro' }]
            .concat(Object.keys(EstadoPedidoEnum).map(key => {
                return {
                    value: key,
                    viewValue: EstadoPedidoEnum[key],
                };
            }));

        this.opcionesEntrega = Object.keys(EntregaPedidoEnum).map(key => {
            return {
                value: key,
                viewValue: EntregaPedidoEnum[key],
            };
        });

        this.opcionesOrdenacion = [
            { value: 'estadoPedido', viewValue: 'Estado del pedido' },
            { value: 'fechaRegistro', viewValue: 'Fecha de registro' },
            { value: 'fechaEntrega', viewValue: 'Fecha de entrega' },
            { value: 'entregaPedido', viewValue: 'Lugar de entrega' },
            { value: 'usuario', viewValue: 'Cuenta cliente' },
        ];

        this.sentidoOrdenacion = [
            { value: 'asc', viewValue: 'Ascendente' },
            { value: 'desc', viewValue: 'Descendente' }
        ];

        this.regConfig = [
            {
                type: 'daterange',
                label: 'Rango registro pedido',
                nameIni: 'diaRegistroIni',
                nameFin: 'diaRegistroFin',
                valueDateIni: null,
                valueDateFin: null,
                class: 'demo-10-width',
                validations: [
                ]
            },
            

            {
                type: 'daterange',
                label: 'Rango entrega pedido',
                nameIni: 'diaEntregaIni',
                nameFin: 'diaEntregaFin',
                valueDateIni: this.filtroPedido.diaEntregaIni,
                valueDateFin: this.filtroPedido.diaEntregaFin,
                class: 'demo-10-width',
                validations: [
                ]
            },

            {
                type: 'time',
                label: 'Hora inicial entrega',
                name: 'horaEntregaIni',
                value: this.filtroPedido.horaEntregaIni,
                class: 'demo-15-width',
                validations: [
                ]
            },
            {
                type: 'time',
                label: 'Hora final entrega',
                name: 'horaEntregaFin',
                value: this.filtroPedido.horaEntregaFin,
                class: 'demo-15-width',
                validations: [
                ]
            },

            {
                type: 'select',
                label: 'Estado',
                name: 'estado',
                value: null,
                class: 'demo-15-width-bajo',
                options: this.opcionesEstado,
                validations: [
                ]
            },

            {
                type: 'select',
                label: 'lugar Entrega',
                name: 'lugarEntrega',
                value: null,
                class: 'demo-15-width-bajo',
                options: this.opcionesEntrega,
                validations: [
                ]
            },

            {
                type: 'input',
                label: 'Cuenta cliente',
                inputType: 'text',
                class: 'demo-25-width',
                name: 'usuario',
                value: null,
                validations: [
                ]
            },
            {
                type: 'select',
                label: 'Ordenación',
                name: 'ordenacion',
                class: 'campoOrdenacion',
                value: 'fechaEntrega',
                options: this.opcionesOrdenacion,
                validations: [
                ]
            },
            {
                type: 'select',
                label: 'sentido Ordenación',
                name: 'sentidoOrdenacion',
                class: 'sentidoOrdenacion',
                value: 'asc',
                options: this.sentidoOrdenacion,
                validations: [
                ]
            },

            {
                type: 'button',
                label: 'Aplicar filtros y ordenación'
            }
        ];


    }

    ngOnInit(): void {
        this.nuevaPagina(0);
        // this.subscripcioneventoCerrarModalScrollable();

    }

    // Es llamado por el paginator
    public getPagina(paginaYSize: any): void {
        const pagina: number = paginaYSize.pagina;
        const size: number = paginaYSize.size;
        this.filtroPedido.size = size.toString();
        this.nuevaPagina(pagina);
    }

    nuevaPagina(pagina: number): void {
        this.filtroPedido.page = pagina.toString();

        //     // test
        if (!this.filterChecked) {
            this.filtroPedido.init();
        }
        //     // test

        this.pedidoService
            .getPedidos(this.filtroPedido)
            .pipe(
                takeUntil(this.unsubscribe$),
                tap((response: any) => {
                })
            )
            .subscribe(
                response => {
                    console.log(`response: ${JSON.stringify(response)}`);

                    this.pedidos = response.content as Pedido[];
                    this.paginador = response;
                    if (isPlatformBrowser(this.platformId)) {
                        window.scrollTo(0, 0);
                    }
                },
                err => this.showErrorService.httpErrorResponse(err, 'Carga de pedidos')
            );
    }

    // public galeriaDetalle(sugerencia: Sugerencia): void {
    //     this.modalConModeloService.openModalScrollable(
    //         GaleriaDetalleComponent,
    //         { size: 'lg', backdrop: 'static', scrollable: true },
    //         sugerencia,
    //         'sugerencia',
    //         'Los campos con * son obligatorios',
    //         'Datos del sugerencia'
    //     ).pipe(
    //         take(1) // take() manages unsubscription for us
    //     ).subscribe(result => {
    //         console.log({ confirmedResult: result });
    //         this.sugerenciaService.getSugerencias(this.filtroPedido).subscribe(respon => {
    //             this.sugerencias = respon.content as Sugerencia[];
    //             this.paginador = respon;
    //         });
    //     });
    // }


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

    // subscripcioneventoNotificacionUpload(): void {
    //     this.modalService.eventoNotificacionUpload.pipe(
    //         takeUntil(this.unsubscribe$),
    //     ).subscribe(
    //         sugerencia => {
    //             console.log('recibido evento fin Upload');
    //             this.sugerencias.map(sugerenciaOriginal => {
    //                 if (sugerenciaOriginal.id === sugerencia.id) {
    //                     sugerenciaOriginal.imgFileName = sugerencia.imgFileName;
    //                 }
    //                 return sugerenciaOriginal;
    //             }); // map
    //         }
    //     );
    // }

    changedFilter(): void {
        if (this.filterChecked) {
            //     this.nuevaPagina(0);
            console.log('filterChecked');
        } else {
            this.filtroPedido.init();
            this.nuevaPagina(0);
        }
    }

    quitarFiltros(): void {
        this.filtroPedido.init();
        this.filterChecked = !this.filterChecked;
        this.nuevaPagina(0);
    }

    submit(value: any): void {
        this.filtroPedido.order = value.ordenacion;
        this.filtroPedido.direction = value.sentidoOrdenacion;

        this.filtroPedido.estado = value.estado;
        this.filtroPedido.diaRegistroIni = value.diaRegistroIni;
        if (value.diaRegistroIni !== null) {
            this.filtroPedido.diaRegistroIni.setHours(0, 0, 0, 0);
        }

        this.filtroPedido.diaRegistroFin = value.diaRegistroFin;
        if (value.diaRegistroFin !== null) {
            this.filtroPedido.diaRegistroFin.setHours(23, 59, 59, 999);
        }

        this.filtroPedido.diaEntregaIni = value.diaEntregaIni;
        if (this.filtroPedido.diaEntregaIni !== null) {
            this.filtroPedido.diaEntregaIni.
                setHours(+value.horaEntregaIni.substr(0, 2),
                    +value.horaEntregaIni.substr(3, 2), 0);
        }
        this.filtroPedido.diaEntregaFin = value.diaEntregaFin;
        if (this.filtroPedido.diaEntregaFin !== null) {
            this.filtroPedido.diaEntregaFin.
                setHours(+value.horaEntregaFin.substr(0, 2),
                    +value.horaEntregaFin.substr(3, 2), 0);
        }
        this.filtroPedido.entregaPedido = value.lugarEntrega;

        this.filtroPedido.usuario = value.usuario;

        console.log(`filtroPedido: ${JSON.stringify(this.filtroPedido)}`);
        console.log(`value: ${JSON.stringify(value)}`);

        this.nuevaPagina(0);
    }

    ngOnDestroy(): void {
        console.log('realizando unsubscribes');
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
