import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdminSliderService } from 'src/app/pages-admin/admin-sliders/admin-slider.service';
import { AdminTiposugerenciaService } from 'src/app/pages-admin/admin-tipoobra/admin-tipoobra.service';
import { EmpresaService } from 'src/app/pages-admin/empresa/empresa.service';
import { environment } from 'src/environments/environment';
import { Empresa } from '../modelos/empresa';
import { Slider } from '../modelos/slider';
import { SliderData } from '../modelos/slider-data';
import { Tiposugerencia } from '../modelos/tiposugerencia';
import { ImageService } from './image-service';
import { ShowErrorService } from './show-error.service';

@Injectable({
  providedIn: 'root'
})
export class ShareEmpresaService {

  private empresaMsg = new ReplaySubject<Empresa>();

  public slider: Slider = new Slider();
  public sliders: Slider [];
  public slidersData: SliderData [] = [];
  // public sliderData: SliderData = new SliderData();
  public tipoobras: Tiposugerencia [] = [];

  private unsubscribe$ = new Subject<void>();
  private observ$: Subscription = null;
  private empresa: Empresa;
  public erroresValidacion: string[];

  constructor(
    private sliderService: AdminSliderService,
    private imageService: ImageService,
    private tipoobraService: AdminTiposugerenciaService,
    private empresaService: EmpresaService,
    private showErrorService: ShowErrorService
    ) {

      console.log('En constructor');
      this.cargaSliders();
      this.cargaTiposugerencias();
      this.cargaEmpresa(1);

     }

  public getEmpresaMsg(): Observable<Empresa>{
    return this.empresaMsg as Observable<Empresa>;
  }

  public updateEmpresaMsg(empresa: Empresa): void {
    this.empresaMsg.next(empresa);
  }

  cargaTiposugerencias(): void {
    this.tipoobraService.getTiposugerencias().pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe (
      response => {
        this.tipoobras = (response as Tiposugerencia[]);
      },
      err => {this.showErrorService.httpErrorResponse(err, 'Error en carga tipos obras', '', 'error');
      }
    );
  }

  getIipoobrasInMem(): Tiposugerencia [] {
    return this.tipoobras;
  }
  cargaSliders(): void {
    this.sliderService.getSliders().pipe(
        takeUntil(this.unsubscribe$),
      ).subscribe(
        response => {
          this.sliders = (response as Slider[]);
          this.cargaSliderData();
        }
        , err => {this.showErrorService.httpErrorResponse(err, 'Error carga sliders de empresa', '', 'error');

        }
      );
  }

  cargaSliderData(): void {
    this.sliders.forEach( (myObject: Slider, index) => {
      if (myObject.imgFileName) {
        this.getImage (myObject );
      }
    });
  }

  // tslint:disable-next-line: typedef
  getImage(slider: Slider) {
    let urlImg: string;
    urlImg =  environment.urlEndPoint +
              '/api/empresa/uploads/img/sliders/' +
              slider.imgFileName;
    this.slider = slider;
    this.imageService.getData(urlImg)
      .subscribe(
        imgData => {
          const sliderData: SliderData = new SliderData();
          sliderData.imgFileData = imgData;
          sliderData.label = slider.label;
          sliderData.descripcion = slider.descripcion;
          this.slidersData.push (sliderData);
        }
        ,
        err => {this.showErrorService.httpErrorResponse(err, 'Error carga imagen slider', '', 'error');
        }
      );
  }

  public copiaEmpresa(): Empresa {
    return this.empresa;
  }

  cargaEmpresa(id: number): void {
    this.observ$ = this.empresaService.get(id).pipe(
      takeUntil(this.unsubscribe$)
    )
      .subscribe(
        json => {
          this.empresa = json;
          if (this.empresa == null) {
            this.empresa = new Empresa();
          }
        }
        , err => {
          if (err.status === 400) {
            console.log('error 400');
            this.erroresValidacion = err.error.errors as string[];
            console.log(this.erroresValidacion);
          } else {this.showErrorService.httpErrorResponse(err, 'Error carga datos empresa', '', 'error');
          }
        }
      );
  }

}
