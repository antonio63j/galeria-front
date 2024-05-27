import { Direccion } from "./direccion";
import { EntregaPedidoEnum } from "./pedido";

export class PedidoConfirmacion {
    fechaEntrega: Date;
    nota: string;
    entregaPedido: EntregaPedidoEnum;
    direccion: Direccion;
}
