import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfilComponent } from './perfil.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PerfilRoutingModule } from './perfil-routing.module';
import { DireccionFormComponent } from './direccion-form/direccion-form.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCheckboxModule,
    PerfilRoutingModule
  ],

  declarations: [
    PerfilComponent,
    DireccionFormComponent
  ]
})
export class PerfilModule { }
