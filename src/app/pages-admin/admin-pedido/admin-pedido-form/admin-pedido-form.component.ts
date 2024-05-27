import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { EstadoPedidoEnum, Pedido } from 'src/app/shared/modelos/pedido';
import { AdminPedidoService } from '../admin-pedido.service';
import swal from 'sweetalert2';
import { OpcionesSelect } from 'src/app/shared/componentes/filtro/field.interface';
import { UntypedFormControl, Validators } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { environment } from 'src/environments/environment';
import { ShowErrorService } from 'src/app/shared/services/show-error.service';
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-admin-pedido-form',
  templateUrl: './admin-pedido-form.component.html',
  styleUrls: ['./admin-pedido-form.component.scss']
})
export class AdminPedidoFormComponent implements OnInit, OnDestroy {

  private subscriptionParams$: Subscription = null;
  private unsubscribe$ = new Subject<void>();
  public observ$: Subscription = null;

  public opcionesEstado: OpcionesSelect[];
  public host: string = environment.urlEndPoint;
  public tipoControl = new UntypedFormControl('', Validators.required);

  public pedido: Pedido;
  public estado: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private adminPedidoService: AdminPedidoService,
    private location: Location,
    private showErrorService: ShowErrorService,
    @Inject(PLATFORM_ID) private platformId: string

  ) {
    this.opcionesEstado = (Object.keys(EstadoPedidoEnum).map(key => {
      return {
        value: key,
        viewValue: EstadoPedidoEnum[key],
      };
    }));
    this.opcionesEstado.forEach((element, index) => {
      if (element.value === 'creacion') { this.opcionesEstado.splice(index, 1); }
    });

    console.log(`this.opecionesEstado=${JSON.stringify(this.opcionesEstado)}`);
  }

  ngOnInit(): void {
    this.subscripcionGestionParams();

  }

  subscripcionGestionParams(): void {
    this.subscriptionParams$ = this.activatedRoute.params
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(params => this.gestionParams(params));
  }

  gestionParams(params: any): void {
    console.log(`parmas:${JSON.stringify(params)}`);

    const pedidoId = params.pedidoId;
    this.getPedido(pedidoId);
  }

  getPedido(pedidoId: string): void {
    this.adminPedidoService.getPedido(pedidoId)
      .pipe(
        takeUntil(this.unsubscribe$),
        tap((response: any) => {
        })
      )
      .subscribe(
        response => {
          this.pedido = response.data as Pedido;
          this.estado = this.pedido.estadoPedido.toLowerCase();
          this.calculosPedido(this.pedido);
          console.log(`pedido=${JSON.stringify(this.pedido)}`);
        }
        , err => this.showErrorService.httpErrorResponse(err, 'Carga carga de pedido', '', 'error')

      );
  }

  cambiarEstado(pedido: Pedido): void {
    pedido.estadoPedido = this.estado.toUpperCase();
    console.log(`pedido to save=${JSON.stringify(pedido)}`);

    this.observ$ = this.adminPedidoService.save(this.pedido).pipe(
      takeUntil(this.unsubscribe$)
    )
      .subscribe(
        response => {
          if (response == null) {
          } else {
            this.pedido = response.data;
            this.calculosPedido(this.pedido);
            console.log(`pedido actualizado=${JSON.stringify(this.pedido)}`);

          }
        }
        , err => this.showErrorService.httpErrorResponse(err, 'Cambio estado de pedido', '', 'error')
      );
  }

  salir(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.location.back();
    }
  }

  public calculosPedido(pedido: Pedido): void {
    pedido.total = 0;
    pedido.numArticulos = 0;

    pedido.pedidoLineaSugerencias.forEach(element => {
      pedido.numArticulos = pedido.numArticulos + element.cantidad;
      pedido.total = pedido.total + (element.cantidad * element.sugerencia.precio);
    });

    pedido.pedidoLineaLotes.forEach(element => {
      pedido.numArticulos = pedido.numArticulos + element.cantidad;
      pedido.total = pedido.total + (element.cantidad * element.lote.precio);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    if (this.observ$ != null && !this.observ$.closed) {
      console.log('haciendo : this.observ$.unsubscribe()');
      this.observ$.unsubscribe();
    } else {
      console.log('No necesario hacer: this.observ$.unsubscribe()');
    }
  }

}
