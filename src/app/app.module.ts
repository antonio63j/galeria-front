import { BrowserModule } from '@angular/platform-browser';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageTranslationModule } from './shared/modules/language-translation/language-translation.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalService } from './shared/services/modal.service';
import { ModalConModeloService } from './shared/services/modal-con-modelo.service';
import { AuthService } from './usuarios/auth.service';
import { AllMaterialModule } from './shared/modules/all-material-module';
import { FormsModule } from '@angular/forms';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { TokenInterceptor } from './usuarios/interceptors/token.interceptor';
import { AuthInterceptor } from './usuarios/interceptors/auth.interceptor';
import { LoggingInterceptor } from './usuarios/interceptors/logging.interceptor';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RecortarPipe } from './shared/pipes/recortar.pipe';
import { PaginatorComponent } from './shared/componentes/paginator/paginator.component';
import { CustomDateAdapter } from './shared/adapters/custom-date-adapter';
import { DatePipe } from '@angular/common';

import {NgcCookieConsentModule, NgcCookieConsentConfig} from 'ngx-cookieconsent';
import { env, environment } from 'src/environments/environment';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MM YYYY',
  },
};

const cookieConfig: NgcCookieConsentConfig = {
  cookie: {
    domain: env.app + environment.domain // it is recommended to set your domain, for cookies to work properly
  },
  palette: {
    popup: {
      background: '#D67124'
    },
    button: {
      background: '#D67124'
    }
  },
  theme: 'classic',
  position: 'bottom-right',
  type: 'opt-out',
  layout: 'basic',
  layouts: {
    'my-custom-layout': '{{messagelink}}{{compliance}}'
  },
  elements: {
    messagelink: `
    <span id="cookieconsent:desc" class="cc-message">{{message}}
      <a aria-label="learn more about cookies" tabindex="0" class="cc-link" href="{{cookiePolicyHref}}" target="_blank">{{cookiePolicyLink}}</a>, 
      <a aria-label="learn more about our privacy policy" tabindex="1" class="cc-link" href="{{privacyPolicyHref}}" target="_blank">{{privacyPolicyLink}}</a> y 
      <a aria-label="learn more about our terms of service" tabindex="2" class="cc-link" href="{{tosHref}}" target="_blank">{{tosLink}}</a>
    </span>
    `,
  },
  content: {
    message: 'By using our site, you acknowledge that you have read and understand our ',

    cookiePolicyLink: 'Política de cookies',
    cookiePolicyHref: environment.urlEndPoint + '/api/politica-cookies',

    privacyPolicyLink: 'Política de privacidad',
    privacyPolicyHref: environment.urlEndPoint + '/api/politica-cookies',

    tosLink: 'Términos del servicio',
    tosHref: environment.urlEndPoint + '/api/politica-cookies',
  }
};

@NgModule({
  declarations: [
    AppComponent,
    RecortarPipe,

  ],

  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    TranslateModule,
    LanguageTranslationModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgbModule,

    MatSelectModule,  // en otro modulo lazy da error al utilizar mat-select
    MatNativeDateModule,

    NgcCookieConsentModule.forRoot(cookieConfig)
  ],

  exports: [

  ],

  providers: [
    ModalService,
    ModalConModeloService,
    AuthService,
    DatePipe,

    // {provide: DEFAULT_CURRENCY_CODE, useValue: 'es'},
    { provide: LOCALE_ID, useValue: 'es' },

    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})

export class AppModule {

}
