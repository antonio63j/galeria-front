
export class DiaDescansoOpciones {
    static dias: string [] = [
        'indefinido',
        'lunes',
        'martes',
        'miércoles',
        'jueves',
        'viernes',
        'sábado',
        'domingo'
        ];
  }

export class Empresa {
    id: number;
    nombre: string;
    cif: string;
    direccion: string;
    localidad: string;
    provincia: string;
    telefono: string;
    email: string;
    urlWeb: string;
    descripcionBreve: string;
    // horario: string;
    portada: string;
    horaApertura: string;
    horaCierre: string;
    diasDescanso: string[];
    horasMinPreparacionPedido: number;
    diasMaxEntregaPedido: number;

}
