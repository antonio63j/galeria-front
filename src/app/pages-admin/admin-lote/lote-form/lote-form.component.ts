import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import swal from 'sweetalert2';

import { Lote } from '../../../shared/modelos/lote';
import { ModalService } from '../../../shared/services/modal.service';
import { AdminLoteService } from '../admin-lote.service';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ShareEmpresaService } from 'src/app/shared/services/share-empresa.service';
import { Tiposugerencia } from 'src/app/shared/modelos/tiposugerencia';
import { UntypedFormControl, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ShowErrorService } from 'src/app/shared/services/show-error.service';

@Component({
  selector: 'app-lote-form',
  templateUrl: './lote-form.component.html',
  styleUrls: ['./lote-form.component.scss']
})

export class LoteFormComponent implements OnInit, OnDestroy {

  host: string = environment.urlEndPoint;
  public lote: Lote;
  private observ$: Subscription = null;
  private unsubscribe$ = new Subject<void>();
  public erroresValidacion: string[];

  public tipoControl = new UntypedFormControl('', Validators.required);

  configDescripcion: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '110',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '110',
    translate: 'no',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Introducir descripción del lote de obras',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    defaultFontSize: '3',
    fonts: [
      {class: 'arial', name: 'Arial'},
      {class: 'times-new-roman', name: 'Times New Roman'},
      {class: 'calibri', name: 'Calibri'},
      {class: 'comic-sans-ms', name: 'Comic Sans MS'}
    ],
    toolbarHiddenButtons: [
      [
       'strikeThrough',
       'subscript',
       'superscript',
      ],
      [
       'link',
       'unlink',
       'insertImage',
       'insertVideo',
       'insertHorizontalRule',
      ]
    ],
    customClasses: [
    {
      name: 'quote',
      class: 'quote',
    },
    {
      name: 'redText',
      class: 'redText'
    },
    {
      name: 'modalTitleText',
      class: 'modalTitleText',
      tag: 'h1',
    },
  ],
  uploadUrl: 'v1/image',
  sanitize: true,
  toolbarPosition: 'top',
  };



  constructor(
    private adminSugerenciaService: AdminLoteService,
    private shareEmpresaService: ShareEmpresaService,
    private modalService: ModalService,
    public activeModal: NgbActiveModal,
    private showErrorService: ShowErrorService
  ) {
  }

  ngOnInit(): void {
  }

  public update(lote: Lote): void {
    this.erroresValidacion = [];
    this.observ$ = this.adminSugerenciaService.update(lote).pipe(
      takeUntil(this.unsubscribe$)
    )
      .subscribe(
        json => {
          this.lote = json.data;

          // se está utilizando activeModal.close(true) en template
          // this.modalService.eventoCerrarModalScrollable.emit();
          swal.fire('lote actualizado', `${json.mensaje}, label: ${json.data.label}`, 'success');
        }
        , err => {
          if (err.status === 400) {
            this.erroresValidacion = err.error.errors as string[];
            console.log(this.erroresValidacion);
          } else {
            this.showErrorService.httpErrorResponse(err, 'Error en actualización de lote', '', 'error');
          }
        }
      );
  }
  public create(lote: Lote): void {
    this.erroresValidacion = [];
    this.observ$ = this.adminSugerenciaService.create(lote).pipe(
      takeUntil(this.unsubscribe$)
    )
      .subscribe(
        json => {
          this.lote = json.data;
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

          swal.fire('creado tipo, no olvide asociar una foto', `${json.mensaje}, nombre: ${json.data.nombre}`, 'success');
        }
        , err => {
          if (err.status === 400) {
            this.erroresValidacion = err.error.errors as string[];
            console.log(this.erroresValidacion);
          } else {
            this.showErrorService.httpErrorResponse(err, 'Error al crear lote', '', 'error');
          }
        }
      );
  }

  changedVisible(valor: any): void {

  }

  changedIndivisible(valor: any): void {

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
