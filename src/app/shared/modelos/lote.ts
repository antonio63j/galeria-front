import { LoteSugerencia } from './lote-sugerencia';

export class Lote {
    id: number;
    label: string;
    precio: number;
    visible: boolean;
    descripcion: string;
    imgFileName: string;
    precioAnterior: number;
    loteSugerencias: LoteSugerencia[] = [];
    indivisible: boolean;
}
