import { ComponenteLote } from './componente-lote.enum';
import { Lote } from './lote';
import { Sugerencia } from './sugerencia';

export class LoteSugerencia {
    id: number;
    lote: Lote;
    sugerencia: Sugerencia;
    // primerPlato: boolean;
    componenteLote: ComponenteLote;
}
