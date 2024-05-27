export enum AccionSobreObjeto {
    CREAR,
    ACTUALIZAR,
    ELIMINAR
}

// import {Proyecto} from '../proyecto';


export interface MsgObjeto {
    accion: AccionSobreObjeto;
    objeto: any;
}
