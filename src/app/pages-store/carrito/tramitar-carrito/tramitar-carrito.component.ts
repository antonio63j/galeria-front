import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { NgxTimepickerFieldComponent } from 'ngx-material-timepicker';
import * as mySettings from '../../../shared/settings/ngx-material-timepicker';
import swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PedidoConfirmacion } from '../../../shared/modelos/pedido-confirmacion';
import { CarritoService } from '../carrito.service';
import { ShareEmpresaService } from 'src/app/shared/services/share-empresa.service';
import { Empresa } from 'src/app/shared/modelos/empresa';
import { OpcionesSelect } from 'src/app/shared/componentes/filtro/field.interface';
import { EntregaPedidoEnum } from 'src/app/shared/modelos/pedido';
import { PerfilService } from 'src/app/usuarios/perfil/perfil.service';
import { Usuario } from 'src/app/shared/modelos/usuario';
import { AuthService } from 'src/app/usuarios/auth.service';
import { Direccion } from 'src/app/shared/modelos/direccion';
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
  selector: 'app-tramitar-carrito',
  templateUrl: './tramitar-carrito.component.html',
  styleUrls: ['./tramitar-carrito.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class TramitarCarritoComponent implements OnInit, OnDestroy {

  @Output() solicitarTramitarCarrito = new EventEmitter<PedidoConfirmacion>();

  private subscriptionParams$: Subscription = null;
  private unsubscribe$ = new Subject<void>();

  public opcionesEntrega: OpcionesSelect[];
  public opcionesDireccion: OpcionesSelect[] = [];
  public entregaDefault: any;
  public direccionDefault: any;
  public usuario: Usuario;

  public lugarEntregaGaleria: string;
  public numDirecciones: number;

  private observ$: Subscription = null;
  private idCarrito: number;

  public hoy: Date = new Date();
  public minDate: Date = new Date();
  public maxDate: Date = new Date();
  public chosenDate: Date;

  public minTimeD: Date;
  public minTime = '00:00';
  public maxTime = '23:59';
  public chosenTime: string;

  public oktTheme = mySettings.timeSettings;
  private pedidoConfirmacion: PedidoConfirmacion = new PedidoConfirmacion();
  public nota: string;

  public empresa: Empresa;
  public diasDescanso: number[];

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view === 'month') {
      // const date = cellDate.getDate();
      const day = cellDate.getDay();
      const b = this.diasDescanso.findIndex(item => item === day);
      return (b > -1) ? 'example-custom-date-class' : '';
    }

    return '';
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private carritoService: CarritoService,
    private shareEmpresaService: ShareEmpresaService,
    private perfilService: PerfilService,
    private authService: AuthService,
    private showErrorService: ShowErrorService
  ) {

    this.lugarEntregaGaleria = EntregaPedidoEnum.galeria;

    this.opcionesEntrega = Object.keys(EntregaPedidoEnum).map(key => {
      return {
        value: key,
        viewValue: EntregaPedidoEnum[key],
      };
    });

    this.opcionEntregaDefault();

    console.log("entrega default:");
    console.log(this.entregaDefault);


    this.empresa = this.shareEmpresaService.copiaEmpresa();
    this.diasDescanso = this.setDiasDescanso();

    this.chosenDate = new Date();
    this.SetPropuestas(new Date());

    this.minDate.setDate(this.chosenDate.getDate());
    this.maxDate.setDate(this.chosenDate.getDate() + this.empresa.diasMaxEntregaPedido);
  }

  ngOnInit(): void {
    this.subscripcionGestionParams();
    this.getUsuario(this.authService.usuario.username);
  }

  private opcionEntregaDefault(): void {
    this.entregaDefault = this.opcionesEntrega[0].value;
  }

  private opcionDireccionDefault(): void {
    this.direccionDefault = this.opcionesDireccion[0].value;
  }

  public cambioEntrega(entrega: EntregaPedidoEnum): void {

    if (entrega.valueOf() === "domicilio") {
      if (this.usuario.direcciones.length < 1) {
        swal.fire('Acceda a su perfil para añadir una dirección', '', 'warning');
        // this.opcionEntregaDefault();
      } else {

        } 
    }  else {
      swal.fire('Únicamente está disponible la opción de entrega a domicilio', '', 'warning');
   }
  }

  public cambioDireccion(direccion: string): void {
    console.log(direccion);
  }

  subscripcionGestionParams(): void {
    this.subscriptionParams$ = this.activatedRoute.params
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(params => this.gestionParams(params));
  }

  gestionParams(params: any): void {
    this.idCarrito = params.idCarrito; // o +params.get('tipo');
  }

  setOpcionesDireccion(): void {
    this.numDirecciones = 0;
    this.usuario.direcciones.forEach((element, index) => {
      this.numDirecciones = this.numDirecciones + 1;
      let opt = {} as OpcionesSelect;
      opt.value = element.id.toString();
      opt.viewValue = element.calle + ',' + element.numero + ',' +
        element.planta + ',' + element.puerta + ',' + element.codigoPostal.toString();
      this.opcionesDireccion.push(opt);
    });
    this.opcionDireccionDefault();
  }

  setDiasDescanso(): number[] {
    const diasDescanso: number[] = [];
    for (const dia of this.empresa.diasDescanso) {
      switch (dia) {
        case 'lunes': {
          diasDescanso.push(1); break;
        }
        case 'martes': {
          diasDescanso.push(2); break;
        }
        case 'miércoles': {
          diasDescanso.push(3); break;
        }
        case 'jueves': {
          diasDescanso.push(4); break;
        }
        case 'viernes': {
          diasDescanso.push(5); break;
        }
        case 'sábado': {
          diasDescanso.push(6); break;
        }
        case 'domingo': {
          diasDescanso.push(0); break;
        }
      }
    }
    return diasDescanso;
  }
  pad(num: number, size: number): string {
    let s = num + '';
    while (s.length < size) { s = '0' + s; }
    return s;
  }

  offsetHora(hora: string, offset: number): string {
    // hora debe tener formato hh:mm
    const h = (Number(hora.substr(0, 2)) + offset) % 24;
    return this.pad(h, 2) + ':' + hora.substr(3, 2);
  }

  SetPropuestas(hoyDate: Date): void {
    // Propone fecha y hora para entrega de pedido y actualiza las siguientes var globales
    // * this.chosenDate
    // * this.chosenTime

    const mananaDate = new Date(hoyDate.getFullYear(), hoyDate.getMonth(), hoyDate.getDate() + 1);

    const ha = this.empresa.horaApertura;
    const hc = this.empresa.horaCierre;

    const hxDate = new Date(hoyDate.getFullYear(), hoyDate.getMonth(), hoyDate.getDate(),
      hoyDate.getHours(), hoyDate.getMinutes());

    const hx = this.pad(hoyDate.getHours(), 2) + ':' + this.pad(hoyDate.getMinutes(), 2);

    const offSetPedido = hoyDate.getHours() + this.empresa.horasMinPreparacionPedido;
    const hp = this.pad(offSetPedido, 2) + ':' + this.pad(hoyDate.getMinutes(), 2);
    const hp24 = this.pad((offSetPedido % 24), 2) + ':' + this.pad(hoyDate.getMinutes(), 2);

    if (ha < hc) {

      if ('00:00' <= hp && hp < ha) {
        this.chosenDate = hoyDate;
        this.chosenTime = this.offsetHora(ha, this.empresa.horasMinPreparacionPedido);
        return;
      }

      if (ha <= hp && hp < hc) {
        this.chosenDate = hoyDate;
        this.chosenTime = hp;
        return;

      }

      if (hc <= hp) {
        this.chosenDate = mananaDate;
        this.chosenTime = this.offsetHora(ha, this.empresa.horasMinPreparacionPedido);
        return;
      }

      swal.fire('Hora entrega de pedido', `Por favor, tenga en cuenta un mínimo de ${this.empresa.horasMinPreparacionPedido} horas para preparar el pedido`, 'warning');

    }

    if (ha === hc) {

      if (hp > '24:00') {
        this.chosenDate = mananaDate;
      } else {
        this.chosenDate = hoyDate;
      }
      this.chosenTime = hp;
      return;
    }

    if (ha > hc) {

      if ('00:00' <= hp && hp < hc) {
        this.chosenDate = hoyDate;
        this.chosenTime = hp;
        return;
      }

      if (hc <= hp && hp < ha) {
        this.chosenDate = mananaDate;
        this.chosenTime = this.offsetHora(ha, this.empresa.horasMinPreparacionPedido);
        return;
      }

      if (ha <= hp) {
        this.chosenDate = hoyDate;
        this.chosenTime = hp;
        return;
      }

      swal.fire('Hora entrega de pedido', `Por favor, tenga en cuenta un mínimo de ${this.empresa.horasMinPreparacionPedido} horas para preparar el pedido`, 'warning');

    }

  }

  timeChanged(event: string): void {
    if (event >= this.minTime && event <= this.maxTime) {
      this.chosenTime = event;
    }
  }

  dateChanged(): void {

    console.log(`chosenDate: ${JSON.stringify(this.chosenDate)}`);

    if (this.chosenDate.getFullYear() === new Date().getFullYear() &&
      this.chosenDate.getMonth() === new Date().getMonth() &&
      this.chosenDate.getDate() === new Date().getDate()
    ) {
      const hoy: Date = new Date();
      this.chosenDate.setHours(hoy.getHours(), hoy.getMinutes());
    }

    this.SetPropuestas(this.chosenDate);
  }

  confirmar(): void {

    console.log(this.entregaDefault);
    console.log(this.direccionDefault);
    if (this.entregaDefault === "domicilio"  && this.direccionDefault === undefined) {
      swal.fire('Necesario acceder al su perfil para añadir una dirección', '', 'warning');
      return;
    }
    if (this.entregaDefault === "galeria") {
      swal.fire('Únicamente está disponible la opción de entrea a domicilio', '', 'warning');
      return;
    }
    swalWithBootstrapButtons.fire({
      title: 'Confirmacion de pedido',
      text: `Confimarás la entrega del pedido para el ${formatDate(this.chosenDate, 'dd/MM/YYYY', 'es-Es')} a las ${this.chosenTime}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.pedidoConfirmacion.fechaEntrega = new Date(this.chosenDate);

        //  this.chosenDate.setHours(hoy.getHours(), hoy.getMinutes());
        this.pedidoConfirmacion.fechaEntrega.setHours(+this.chosenTime.substr(0, 2),
          +this.chosenTime.substr(3, 2), 0);

        this.pedidoConfirmacion.entregaPedido = this.entregaDefault.toUpperCase();
        if (this.entregaDefault === EntregaPedidoEnum.domicilio) {
          this.pedidoConfirmacion.direccion = this.usuario.direcciones.find(x => x.id === +this.direccionDefault);
        } else {
          this.pedidoConfirmacion.direccion = null;
        }

        this.pedidoConfirmacion.nota = this.nota;

        console.log(`pedidoConfirmacion: ${JSON.stringify(this.pedidoConfirmacion)}`);

        this.solicitarTramitarCarrito.emit(this.pedidoConfirmacion);

      }
    });
  }

  getUsuario(cuenta: string): void {
    this.observ$ = this.perfilService.getUsuario(cuenta).pipe(
      takeUntil(this.unsubscribe$)
    )
      .subscribe(
        json => {
          this.usuario = json;
          if (this.usuario == null) {
            swal.fire('Error en acceso datos usuario', cuenta, 'error');
          } else {
            if (this.usuario.direcciones.length > 0) {
              this.setOpcionesDireccion();
            }
          }
        }
        , err => {this.showErrorService.httpErrorResponse(err, 'Error acceso a usuario', '', 'error');
        }
      );
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy ()');
  }

}

