import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';
import { AdminSugerenciaService } from 'src/app/pages-admin/admin-sugerencia/admin-sugerencia.service';
import { DynamicFormComponent } from 'src/app/shared/componentes/filtro/dynamic-form/dynamic-form.component';
import { FieldConfig, OpcionesSelect } from 'src/app/shared/componentes/filtro/field.interface';
import { Validators } from '@angular/forms';
import { FiltroSugerencia } from 'src/app/shared/modelos/filtro-sugerencia';
import { Sugerencia } from 'src/app/shared/modelos/sugerencia';
import { Tiposugerencia } from 'src/app/shared/modelos/tiposugerencia';
import { ModalConModeloService } from 'src/app/shared/services/modal-con-modelo.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { ShareEmpresaService } from 'src/app/shared/services/share-empresa.service';
import { AuthService } from 'src/app/usuarios/auth.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import swal from 'sweetalert2';

import { GaleriaDetalleComponent } from './galeria-detalle/galeria-detalle.component';
import { CarritoService } from '../carrito/carrito.service';
import { ShowErrorService } from 'src/app/shared/services/show-error.service';
import { isPlatformBrowser } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { Empresa } from 'src/app/shared/modelos/empresa';
import { AdminTiposugerenciaService } from 'src/app/pages-admin/admin-tipoobra/admin-tipoobra.service';
import { EmpresaService } from 'src/app/pages-admin/empresa/empresa.service';
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
    selector: 'app-galeria',
    templateUrl: './galeria.component.html',
    styleUrls: ['./galeria.component.scss']
})

export class GaleriaComponent implements OnInit, OnDestroy {

    @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

    sugerencias: Sugerencia[];
    sugerencia: Sugerencia = new Sugerencia();

    host: string = environment.urlEndPoint;
    private unsubscribe$ = new Subject<void>();
    public paginador: any;

    public tipoObras: Tiposugerencia[];
    public empresa: Empresa;

    public filterChecked = false;
    public filtroSugerencia: FiltroSugerencia = new FiltroSugerencia(12);

    public disable = true;

    regConfig: FieldConfig[];

    public opcionesObras: OpcionesSelect[];
    public opcionesOrdenacion: OpcionesSelect[];
    public sentidoOrdenacion: OpcionesSelect[];

    constructor(
        private sugerenciaService: AdminSugerenciaService,
        private shareEmpresaService: ShareEmpresaService,
        private modalConModeloService: ModalConModeloService,
        private modalService: ModalService,
        private translate: TranslateService,
        private authService: AuthService,
        private carritoService: CarritoService,
        private showErrorService: ShowErrorService,
        @Inject(PLATFORM_ID) private platformId: string,
        private titleService: Title,
        private metaTagService: Meta,
        private tipoobraService: AdminTiposugerenciaService,
        private empresaService: EmpresaService,
        private canonicalService: CanonicalService

    ) {
        this.filtroSugerencia.setSoloVisibles();
        this.sugerencias = [];
        this.tipoObras = this.shareEmpresaService.getIipoobrasInMem();
        this.empresa = this.shareEmpresaService.copiaEmpresa();

        this.opcionesObras = [{ value: null, viewValue: 'sin filtro' }].concat(this.tipoObras.map(item => ({
            value: item.nombre, viewValue: item.nombre
        })
        ));

        this.opcionesOrdenacion = [
            { value: 'label', viewValue: 'Nombre' },
            { value: 'tipo', viewValue: 'Tipo Obra' },
            { value: 'precio', viewValue: 'Precio' },
        ];

        this.sentidoOrdenacion = [
            { value: 'asc', viewValue: 'Ascendente' },
            { value: 'desc', viewValue: 'Descendente' }
        ];

        this.regConfig = [
            {
                type: 'input',
                label: 'Nombre',
                inputType: 'text',
                class: 'demo-15-width',
                name: 'label',
                validations: [
                ]
            },
            {
                type: 'select',
                label: 'Tipo obra',
                name: 'tipo',
                value: null,
                class: 'demo-15-width',
                options: this.opcionesObras,
                validations: [
                ]
            },
            {
                type: 'input',
                label: 'Precio mim.',
                class: 'demo-precio-width',
                inputType: 'number',
                name: 'precioMin',
                validations: [
                ]
            },
            {
                type: 'input',
                label: 'Precio max.',
                class: 'demo-precio-width',
                inputType: 'number',
                name: 'precioMax',
                validations: [
                ]
            },
            {
                type: 'select',
                label: 'Ordenación',
                name: 'ordenacion',
                class: 'campoOrdenacion',
                value: 'label',
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
        this.datosTitleMetaTagsAndCanonical();

        this.nuevaPagina(0);
        this.subscripcioneventoCerrarModalScrollable();

    }

    datosTitleMetaTagsAndCanonical(): void{

        if (this.tipoObras.length === 0) {
          this.cargaTipoObras();
        } else if (this.empresa === undefined) {
                 this.cargaEmpresa(1);
               } else {
                   this.updateTitleAndMetaTags();
               }
    }

    updateTitleAndMetaTags(): void{
        const tObras = Array.prototype.map.call(this.tipoObras, s => s.nombre).toString();

        this.titleService.setTitle(`${this.empresa.nombre} tu galeria en ${this.empresa.localidad} (${this.empresa.provincia}) te presenta su galeria para elegir online`);
        // this.metaTagService.updateTag({name: 'keywords', content: `obras de nuestra galeria: ${tObras}`});
        this.metaTagService.updateTag({name: 'description', content: `galeria en ${this.empresa.localidad} ( ${this.empresa.provincia} ), \
en nuestro galeria puedes crear online tu pedido a partir de la galeria, \
y podremos entregar el pedido a domicilio o vienes recoger`}, `name='description'`);

        this.canonicalService.updateCanonicalUrl ();
    }

      cargaTipoObras(): void {
        this.tipoobraService.getTiposugerencias().pipe(
            takeUntil(this.unsubscribe$),
          ).subscribe (
            response => {
              this.tipoObras = (response as Tiposugerencia[]);
              if (this.empresa === undefined) {
                  this.cargaEmpresa(1);
              } else {
                  this.updateTitleAndMetaTags();
              }
            },
            err => {this.showErrorService.httpErrorResponse(err, 'Error en carga tipos obras', '', 'error');
            }
          );
      }

    cargaEmpresa(id: number): void {
        this.empresaService.get(id).pipe(
            takeUntil(this.unsubscribe$)
          )
            .subscribe(
              json => {
                this.empresa = json;
                this.updateTitleAndMetaTags();
              }
              , err => this.showErrorService.httpErrorResponse(err, 'Error carga datos empresa', '', 'error')

            );
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

        console.log('filtroSugerencia:');
        console.log(JSON.stringify(this.filtroSugerencia));

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

    public galeriaDetalle(sugerencia: Sugerencia): void {
        this.modalConModeloService.openModalScrollable(
            GaleriaDetalleComponent,
            { size: 'lg', backdrop: 'static', scrollable: true },
            sugerencia,
            'sugerencia',
            'Los campos con * son obligatorios',
            'Datos del sugerencia'
        ).pipe(
            take(1) // take() manages unsubscription for us
        ).subscribe(result => {
            console.log({ confirmedResult: result });

            // this.sugerenciaService.getSugerencias(this.filtroSugerencia).subscribe(respon => {
            //     this.sugerencias = respon.content as Sugerencia[];
            //     this.paginador = respon;

//         });
        });
    }

    public comprar(sugerencia: Sugerencia): void {
        this.galeriaDetalle(sugerencia);
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
            //     this.nuevaPagina(0);
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

    submit(value: any): void {
        this.filtroSugerencia.label = value.label;
        this.filtroSugerencia.tipo = value.tipo;
        this.filtroSugerencia.precioMin = value.precioMin;
        this.filtroSugerencia.precioMax = value.precioMax;
        this.filtroSugerencia.order = value.ordenacion;
        this.filtroSugerencia.direction = value.sentidoOrdenacion;
        this.nuevaPagina(0);
    }

    ngOnDestroy(): void {
        console.log('realizando unsubscribes');
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}


