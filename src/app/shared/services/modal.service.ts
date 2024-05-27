import { Injectable, EventEmitter } from '@angular/core';


@Injectable()

export class ModalService {

  private modal: boolean;
  private _eventoNotificacionUpload = new EventEmitter<any> ();
  private _eventoCerrarModalScrollable = new EventEmitter<any> ();

  constructor() { }

  get eventoNotificacionUpload():  EventEmitter<any> {
    return this._eventoNotificacionUpload;
  }

  get eventoCerrarModalScrollable(): EventEmitter<any> {
    return this._eventoCerrarModalScrollable;
  }

/*   abrirModal() {
    this.modal = true;
  }

  cerralModal() {
    this.modal = false;
  }
  getModal(): boolean {
    return this.modal;
  } */
}
