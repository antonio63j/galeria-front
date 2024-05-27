import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesStoreRoutingModule } from './pages-store-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UploadFotoComponent } from '../shared/componentes/upload-foto/upload-foto.component';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { PaginatorComponent } from '../shared/componentes/paginator/paginator.component';
import { MatSelectModule } from '@angular/material/select';
import { MatSlider, MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { GaleriaComponent } from './galeria/galeria.component';
import { LoteComponent } from './lote/lote.component';
import { RecortarPipe } from '../shared/pipes/recortar.pipe';
// import { SharedPipesModule } from '../shared';
import { LoteDetalleComponent } from './lote/lote-detalle/lote-detalle.component';
import { BrowserModule } from '@angular/platform-browser';
import { PaginatorModule } from '../shared/componentes/paginator/paginator.module';
import {MatRadioModule} from '@angular/material/radio';
import { FiltroModule } from '../shared/componentes/filtro/filtro.module';
import { DynamicFormComponent } from '../shared/componentes/filtro/dynamic-form/dynamic-form.component';
import { DynamicFieldDirective } from '../shared/componentes/filtro/dynamic-field/dynamic-field.directive';
import { GaleriaDetalleComponent } from './galeria/galeria-detalle/galeria-detalle.component';
import { CarritoComponent } from './carrito/carrito.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TramitarCarritoComponent } from './carrito/tramitar-carrito/tramitar-carrito.component';
// import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter } from '@angular/material/core';
import { CustomDateAdapter } from '../shared/adapters/custom-date-adapter';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';


@NgModule({
  declarations: [
    GaleriaComponent,
    GaleriaDetalleComponent,
    LoteComponent,
    LoteDetalleComponent,

    // DynamicFieldDirective,
    // DynamicFormComponent,

    CarritoComponent,
    TramitarCarritoComponent,

  ],

  imports: [
    CommonModule,

    PagesStoreRoutingModule,
    TranslateModule,

    FormsModule,

    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSortModule,

    MatSliderModule,
    MatSlideToggleModule,

    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    AngularEditorModule,

    PaginatorModule,
    FiltroModule,
    MatRadioModule,

    FlexLayoutModule,

    MatDatepickerModule,
    NgxMaterialTimepickerModule


  ],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
  ],

  exports: [
    TranslateModule,

    FormsModule,

    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSortModule,

    MatSliderModule,
    MatSlideToggleModule,

    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    AngularEditorModule,
    // MatDatepickerModule
  ]
})
export class PagesStoreModule { }
