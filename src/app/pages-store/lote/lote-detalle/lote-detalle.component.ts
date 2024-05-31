import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import swal from 'sweetalert2';

import { Lote } from 'src/app/shared/modelos/lote';
import { LoteSugerencia } from 'src/app/shared/modelos/lote-sugerencia';
import { environment } from 'src/environments/environment';
import { ComponenteLote } from 'src/app/shared/modelos/componente-lote.enum';
import { AuthService } from 'src/app/usuarios/auth.service';
import { CarritoService } from '../../carrito/carrito.service';
import { CantidadesOpciones, PedidoLineaLote } from 'src/app/shared/modelos/pedido';
import { Sugerencia } from 'src/app/shared/modelos/sugerencia';


@Component({
  selector: 'app-lote-detalle',
  templateUrl: './lote-detalle.component.html',
  styleUrls: ['./lote-detalle.component.scss']
})

export class LoteDetalleComponent implements OnInit {
  host: string = environment.urlEndPoint;
  public lote: Lote;
  public cantidad = 1;

  public cantidades: number[] = CantidadesOpciones.cantidades;

  public cantidadMax = this.cantidades.length;

  primeros: LoteSugerencia[] = [];
  segundos: LoteSugerencia[] = [];
  postres: LoteSugerencia[] = [];

  // primero: LoteSugerencia;
  // segundo: LoteSugerencia;
  // postre: LoteSugerencia;

  primero: Sugerencia;
  segundo: Sugerencia;
  postre: Sugerencia;

  constructor(
    public activeModal: NgbActiveModal,
    public authService: AuthService,
    public carritoService: CarritoService
  ) {

   }


  addLote(lote: Lote): void {
    if (false ) {
      swal.fire('Aviso', 'Falta opción por seleccionar', 'warning');
    } else {
        if (this.cantidad < 1 || this.cantidad > 20) {
          swal.fire('Aviso', `Cantidad deber estar entre 1 y ${this.cantidadMax}`, 'warning');
        } else {
            const pedidoLineaLote: PedidoLineaLote = new PedidoLineaLote();
            pedidoLineaLote.cantidad = this.cantidad;
            pedidoLineaLote.precioInicio = lote.precio;

            pedidoLineaLote.lote = this.lote;
            
          /* 
            pedidoLineaLote.primero = this.primero;
            pedidoLineaLote.segundo = this.segundo;
            pedidoLineaLote.postre = this.postre;
          */        

            console.log(`pedidoLinaLote: ${JSON.stringify(pedidoLineaLote)}`);

            this.carritoService.addPedidoLineaLote(pedidoLineaLote);
            this.activeModal.close('con accept');
        }
    }
  }

  cambioCantidad(): void {
  }

  ngOnInit(): void {
      this.primeros = this.lote.loteSugerencias.filter(element => {
        return element.componenteLote === ComponenteLote.primero;
      });
      this.segundos = this.lote.loteSugerencias.filter(element => {
        return element.componenteLote === ComponenteLote.segundo;
      });
      this.postres = this.lote.loteSugerencias.filter(element => {
        return element.componenteLote === ComponenteLote.postre;
      });
  }

}
