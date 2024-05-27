import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { SignupModalComponent } from '../signup/signup-modal/signup-modal.component';
import { SignupModule } from '../signup/signup.module';

// import { ModalFormModule } from 'src/shared/modules/modal-form/modal-form.module';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { PwdResetModalComponent } from './pwd-reset-modal/pwd-reset-modal.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    LoginRoutingModule,
    FormsModule,

    MatIconModule,

    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    SignupModule
  ],

  declarations: [
    LoginComponent,
    LoginModalComponent,
    PwdResetModalComponent,

  ],
  exports: [

  ]

})
export class LoginModule { }
