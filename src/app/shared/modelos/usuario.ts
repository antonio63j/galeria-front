import { Direccion } from './direccion';

export class Usuario {
    id: number;
    username: string;
    password: string;
    nombre: string;
    apellidos: string;
    telefono: string;
    email: string;
    fechaRegistro: Date;
    codActivacion: string;
    finalizadaActivacion: boolean;
    fechaResetPwd: Date;
    codResetPwd: string;
    enabled: boolean;
    aceptaEmails: boolean;
    roles: string[] = [];
    direcciones: Direccion[];
}
