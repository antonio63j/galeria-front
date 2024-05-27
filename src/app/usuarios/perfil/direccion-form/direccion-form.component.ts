import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Direccion } from 'src/app/shared/modelos/direccion';

@Component({
  selector: 'app-direccion-form',
  templateUrl: './direccion-form.component.html',
  styleUrls: ['./direccion-form.component.css']
})
export class DireccionFormComponent implements OnInit {

  public direccion: Direccion;

  constructor(
    public activeModal: NgbActiveModal

  ) {

   }

  ngOnInit(): void {
  }

  addDireccion(direccion: Direccion): void {
    this.activeModal.close(direccion);
  }

  update(direccion: Direccion): void {
    this.activeModal.close(direccion);
  }

}
