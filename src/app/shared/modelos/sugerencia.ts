export enum EstadoSugerenciaEnum {
    disponible = 'DISPONIBLE',
    reservado = 'RESERVADO',
    vendido = 'VENDIDO',
}

export class Sugerencia {
    id: number;
    label: string;
    tipo: string;
    descripcion: string;
    imgFileName: string;
    precio: number;
    precioAnterior: number;
    visible: string;
    alto: number;
    ancho: number;
    fondo: number;
    estado: EstadoSugerenciaEnum;
    fechaCambioEstado: Date;
    loteNombre: string;

}
