import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ShowErrorService {

  constructor() { }

  public httpErrorResponse(err: HttpErrorResponse,
                           errTxt?: string,
                           errTxt2?: string,
                           tipoAviso?: SweetAlertIcon): void {

    if (errTxt === undefined) {
      errTxt = '';
    }
    if (errTxt2 === undefined) {
      errTxt2 = '';
    }
    if (tipoAviso === undefined) {
      tipoAviso = 'error';
    }


    console.log(errTxt + '-' + errTxt2 + ` ${JSON.stringify(err)}`);

    switch (err.status) {

      case 0: {
        swal.fire(errTxt, `Problema con backend status= ${err.status}  ${errTxt2}`, tipoAviso);
        break;
      }
      case 400: {
        swal.fire(errTxt, `${errTxt2} status= ${err.status} ${errTxt2}` , tipoAviso);
        break;
      }
      case 401: {
        swal.fire(errTxt, `Sin autorización de acceso, inicie sesión. status= ${err.status} ${errTxt2}`, 'warning');
        break;
      }
      case 501: {
        break;
      }
      default: {
        swal.fire(errTxt, `status= ${err.status}, statusText= ${err.statusText} ${errTxt2}`, 'error');
        break;
      }
    }

  }
}

