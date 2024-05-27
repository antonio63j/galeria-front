import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Slider } from '../../shared/modelos/slider';

@Injectable({
  providedIn: 'root'
})
export class AdminSliderService implements OnDestroy {

  constructor(private http: HttpClient,
    //  public authService: AuthService
  ) { }

  getSliders(): Observable<any> {
    return this.http.get<Slider[]>(environment.urlEndPoint + '/api/empresa/sliders').pipe(
      tap((response: any) => {
        //  (response.content as slider[]).forEach (slider => console.log(slider));
      }),
      map((response: any) => {
        (response as Slider[]).map(sli => {
          return sli;
        });
        return response;
      }),
      tap((response: any) => {
        /* (response.content as slider[]).forEach (slider => console.log(slider)); */
      })
    );
  }

  create(slider: Slider): Observable<any> {
    /* se añade el token con TokenInterceptor
    return this.http.post<any>(this.urlEndPoint, slider, { headers: this.httpHeader }); */
    slider.id = null;
    return this.http.post<Slider>(environment.urlEndPoint + '/api/empresa/slider', slider).pipe(
      catchError(err => {
        console.log(`error capturado en create: ${err.error.error} `);
        return throwError(err);
      })
    );
  }

  update(slider: Slider): Observable<any> {
    return this.http.put(environment.urlEndPoint + '/api/empresa/slider', slider).pipe(
      catchError(err => {
        console.log(`error al actualizar datos del slider: ${err.message} `);
        return throwError(err);
      })
      // , map((response: any) => response.slider as slider)
    );
  }

  delete(id: number): Observable<Slider> {
    return this.http.delete<Slider>(`${environment.urlEndPoint}/api/empresa/slider/${id}`).pipe(
      catchError(err => {
        console.error(`error al eliminar slider: ${err.status} `);
        console.error(`error al eliminar slider: ${err.message} `);
        return throwError(err);
      }));
  }

  ngOnDestroy(): void {
    console.log('sliderService.ngOnDestroy ()');
  }

}
