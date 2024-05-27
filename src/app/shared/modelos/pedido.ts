import { Direccion } from './direccion';
import { Lote } from './lote';
import { Sugerencia } from './sugerencia';

export enum EntregaPedidoEnum {
  domicilio = 'DOMICILIO',
  galeria = 'GALERIA'
}

export enum EstadoPedidoEnum {
    creacion = 'CREACION',
    confirmado = 'CONFIRMADO',
    rechazado = 'RECHAZADO',
    listo = 'LISTO',
    pagado = 'PAGADO'
}

export class CantidadesOpciones {
  static cantidades: number [] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
}

export class PedidoLineaSugerencia {
    id: number;
    cantidad: number;
    precioInicio: number;
    sugerencia: Sugerencia;

    constructor() {
        this.id = null;
        this.cantidad = 0;
        this.precioInicio = 0;
        this.sugerencia = new Sugerencia();
        this.sugerencia.id = null;
    }
}

export class PedidoLineaLote {
    id: number;
    cantidad: number;
    precioInicio: number;
    lote: Lote;
    primero: Sugerencia;
    segundo: Sugerencia;
    postre: Sugerencia;
}

export class Pedido {
    id: number;
    usuario: string;
    estadoPedido: EstadoPedidoEnum;
    entregaPedido: EntregaPedidoEnum;
    direccion: Direccion;
    total: number;
    numArticulos: number;

    fechaRegistro: string;
    fechaEntrega: string;
    nota: string;
    pedidoLineaSugerencias: PedidoLineaSugerencia [] = [];
    pedidoLineaLotes: PedidoLineaLote [] = [];

    constructor(usuario?: string) {
       if (usuario !== undefined) {
        this.usuario = usuario;
       }
    }


}
