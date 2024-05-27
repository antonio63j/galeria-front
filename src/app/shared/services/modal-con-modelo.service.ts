import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OnDestroy, Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable ()

export class ModalConModeloService implements OnDestroy {
    modal: any;

    constructor(private ngbModal: NgbModal) {
    }

    public openModalScrollable(
        componente,
        configuracion,
        modelo,
        modeloNombreEnModal,
        prompt = 'Really?',
        title = 'Confirm'
    ): Observable<any> {
        this.modal = this.ngbModal.open(
            componente,
            configuracion);
        this.modal.componentInstance[modeloNombreEnModal] = modelo;
        this.modal.componentInstance.prompt = prompt;
        this.modal.componentInstance.title = title;

        return from(this.modal.result).pipe(
            catchError(error => {
                console.error (error);
                return of(undefined);
            })
        );

    }

    closeModalScrollable(): void {
        this.modal.close();
    }

    ngOnDestroy(): void {
        console.log('En ngOnDestroy()');
    }
}
