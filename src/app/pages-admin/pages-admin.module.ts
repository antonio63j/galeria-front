import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesAdminRoutingModule } from './pages-admin-routing.module';
import { AdminIndexComponent } from './admin-index/admin-index.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EmpresaComponent } from './empresa/empresa.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { UploadFotoComponent } from '../shared/componentes/upload-foto/upload-foto.component';
import { AdminSlidersComponent } from './admin-sliders/admin-sliders.component';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { SliderFormComponent } from './admin-sliders/slider-form/slider-form.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AdminTiposugerenciaComponent } from './admin-tipoobra/admin-tipoobra.component';
import { TiposugerenciaFormComponent } from './admin-tipoobra/tipoobra-form/tipoobra-form.component';
import { AdminSugerenciaComponent } from './admin-sugerencia/admin-sugerencia.component';
import { AdminLoteComponent } from './admin-lote/admin-lote.component';
import { SugerenciaFormComponent } from './admin-sugerencia/sugerencia-form/sugerencia-form.component';
import { PaginatorComponent } from '../shared/componentes/paginator/paginator.component';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatSlider, MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LoteFormComponent } from './admin-lote/lote-form/lote-form.component';
import { AdminLoteSugerenciaComponent } from './admin-lote-sugerencia/admin-lote-sugerencia.component';
import { LowerCasePipe } from '@angular/common';
import { RecortarPipe } from '../shared/pipes/recortar.pipe';
import { LayoutModule } from '../layout/layout.module';
import { PaginatorModule } from '../shared/componentes/paginator/paginator.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AdminPedidoComponent } from './admin-pedido/admin-pedido.component';
import { DynamicFieldDirective } from '../shared/componentes/filtro/dynamic-field/dynamic-field.directive';
import { DynamicFormComponent } from '../shared/componentes/filtro/dynamic-form/dynamic-form.component';
import { FiltroModule } from '../shared/componentes/filtro/filtro.module';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { CustomDateAdapter } from '../shared/adapters/custom-date-adapter';
import { AdminPedidoFormComponent } from './admin-pedido/admin-pedido-form/admin-pedido-form.component';
import { MatRadioModule } from '@angular/material/radio';

@NgModule({
  declarations: [
    AdminIndexComponent,
    EmpresaComponent,
    AdminHomeComponent,
    AdminSlidersComponent,
    SliderFormComponent,
    AdminTiposugerenciaComponent,
    TiposugerenciaFormComponent,
    UploadFotoComponent,
    AdminSugerenciaComponent,
    AdminLoteComponent,
    LoteFormComponent,
    SugerenciaFormComponent,
    AdminLoteSugerenciaComponent,
    AdminPedidoComponent,
    AdminPedidoFormComponent,
  ],

  imports: [
    CommonModule,
    PagesAdminRoutingModule,
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
    LayoutModule,
    FlexLayoutModule,
    PaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule,
    FiltroModule,
    MatRadioModule

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

    MatNativeDateModule,

    MatDatepickerModule,
    NgxMaterialTimepickerModule
  ]
})
export class PagesAdminModule { }
