import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'recortar'
})
export class RecortarPipe implements PipeTransform {

  transform(value: string, numBytes?: number): any {
    if (value === null) {return null;}

    console.log('value=' + value);
    console.log('numBytes=' + numBytes);
    console.log('len value=' + value.length);

    return null;
  }

}
