import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import swal from 'sweetalert2';

import { Slider } from '../../../shared/modelos/slider';
import { ModalService } from '../../../shared/services/modal.service';
import { AdminSliderService } from '../admin-slider.service';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ShowErrorService } from 'src/app/shared/services/show-error.service';

@Component({
  selector: 'app-slider-form',
  templateUrl: './slider-form.component.html',
  styleUrls: ['./slider-form.component.scss']
})
export class SliderFormComponent implements OnInit, OnDestroy {

  host: string = environment.urlEndPoint;
  public slider: Slider;
  private observ$: Subscription = null;
  private unsubscribe$ = new Subject<void>();
  public erroresValidacion: string[];

  constructor(
    private adminSliderService: AdminSliderService,
    private modalService: ModalService,
    public activeModal: NgbActiveModal,
    private showErrorService: ShowErrorService
  ) { }

  ngOnInit(): void {
  }

  public update(slider: Slider): void {
    this.erroresValidacion = [];
    this.observ$ = this.adminSliderService.update(slider).pipe(
      takeUntil(this.unsubscribe$)
    )
      .subscribe(
        json => {
          this.slider = json.data;

          // se está utilizando activeModal.close(true) en template
          // this.modalService.eventoCerrarModalScrollable.emit();
          swal.fire('slider actualizado', `${json.mensaje}, label: ${json.data.label}`, 'success');
        }
        , err => {
          if (err.status === 400) {
            this.erroresValidacion = err.error.errors as string[];
            console.log(this.erroresValidacion);
          } else {
            this.showErrorService.httpErrorResponse(err, 'Error actualización imagen portada', '', 'error');
          }
        }
      );
  }
  public create(slider: Slider): void {
    this.erroresValidacion = [];
    this.observ$ = this.adminSliderService.create(slider).pipe(
      takeUntil(this.unsubscribe$)
    )
      .subscribe(
        json => {
          this.slider = json.data;
          // this.activeModal.close(true);
          // el cierre del modal se podría hacer con:

          // se está utilizando activeModal.close(true) desde el template
          // this.modalService.eventoCerrarModalScrollable.emit();

          // en lugar de activModal.close(true), se podría emitir evento
          // para cerrar modal con:
          // this.modalService.eventoCerrarModalScrollable.emit();
          // podriamos emitir este evento para cerrar modal con la
          // subscripcion que se hace con subscripcioneventoCerrarModalScrollable()
          // desde ClientesComponent

          swal.fire('creado slider, no olvide asociar una foto', `${json.mensaje}, label: ${json.data.label}`, 'success');
        }
        , err => {
          if (err.status === 400) {
            this.erroresValidacion = err.error.errors as string[];
            console.log(this.erroresValidacion);
          } else {
            this.showErrorService.httpErrorResponse(err, 'Error creación imagen portada', '', 'error');
          }
        }
      );
  }

  ngOnDestroy(): void{
    console.log('ngOnDestroy (), realizando unsubscribes');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    if (this.observ$ != null && !this.observ$.closed) {
      console.log('haciendo : this.observ$.unsubscribe()');
      this.observ$.unsubscribe();
    } else {
      console.log('No necesario hacer: this.observ$.unsubscribe()');
    }
  }

}
