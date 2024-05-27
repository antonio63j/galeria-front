import { Injectable } from '@angular/core';

import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CifradoService {

private key = 'KeyToCrypto-js';

constructor() { }

  cifrarTexto(value): string {
    return CryptoJS.AES.encrypt(value, this.key).toString();
  }

  descifrarTexto(value: string): string {
    const bytes  = CryptoJS.AES.decrypt(value, this.key);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  cifrarObjeto(value): string{
    return CryptoJS.AES.encrypt(JSON.stringify(value), this.key).toString();
  }

  descifrarObjeto(value): any{
    const bytes  = CryptoJS.AES.decrypt(value, this.key);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

}
