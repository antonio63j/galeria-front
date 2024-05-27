import { Component, OnDestroy, OnInit, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Empresa } from './shared/modelos/empresa';
import { ShareEmpresaService } from './shared/services/share-empresa.service';
import { EmpresaService } from './pages-admin/empresa/empresa.service';
import { CarritoService } from './pages-store/carrito/carrito.service';
import { AuthService } from './usuarios/auth.service';
import { ShowErrorService } from './shared/services/show-error.service';
import { ConectorSocketService } from './shared/services/conector-socket.service';
import { NgcCookieConsentService,  NgcInitializingEvent, 
  NgcInitializationErrorEvent, NgcNoCookieLawEvent, NgcStatusChangeEvent } from 'ngx-cookieconsent';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';

import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { constants } from 'fs';

import { CookieParams } from '../app/cookies/cookie-params';
import { environment } from 'src/environments/environment';
import { ModalConModeloService } from 'src/app/shared/services/modal-con-modelo.service';
import { CookieDetalleComponent } from './cookies/cookie-detalle/cookie-detalle.component';
import { BrowserStack } from 'protractor/built/driverProviders';
import { CanonicalService } from './shared/services/canonical.service';

declare var gtag;

// Declare gTM dataLayer array.
declare global {
  interface Window { dataLayer: any[]; }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private observ$: Subscription = null;
  private unsubscribe$ = new Subject<void>();
  empresa: Empresa;

  // keep refs to subscriptions to be able to unsubscribe later
/*   private popupOpenSubscription: Subscription;
  private popupCloseSubscription: Subscription;
  private initializeSubscription: Subscription;
  private statusChangeSubscription: Subscription;
  private revokeChoiceSubscription: Subscription;
  private noCookieLawSubscription: Subscription; */

    //keep refs to subscriptions to be able to unsubscribe later
  private popupOpenSubscription!: Subscription;
  private popupCloseSubscription!: Subscription;
  private initializingSubscription!: Subscription;
  private initializedSubscription!: Subscription;
  private initializationErrorSubscription!: Subscription;
  private statusChangeSubscription!: Subscription;
  private revokeChoiceSubscription!: Subscription;
  private noCookieLawSubscription!: Subscription;

  private cookieParams: CookieParams;


  constructor(
    private empresaService: EmpresaService,
    private shareEmpresaService: ShareEmpresaService,
    private carritoService: CarritoService,
    private authService: AuthService,
    private showErrorService: ShowErrorService,
    private conectorSocketService: ConectorSocketService,
    private ccService: NgcCookieConsentService,
    private translateService: TranslateService,
    @Inject(PLATFORM_ID) private platformId: string,
    private titleService: Title,
    private metaTagService: Meta,
    private canonicalService: CanonicalService,
    private router: Router,
    private modalConModeloService: ModalConModeloService
  ) {

    // window.dataLayer.push({'cookiesSet': true});
    // this.indicarUserConsent();

    console.log('arranque app.component, username: ---------------------------');
    console.log(this.authService.usuario.username);
    this.getEmpresa(1);
    this.conectorSocketService.connect();

    // No se utiliza, para este cometido se está utilizando GTM (Google Tag Manager)
    // --------------------------------------------------------
    // this.cookieParams = {
    //   googleAnalyticsDivName: 'divGoogleAnalytics',
    //   googleAnalyticsId: environment.googleAnalyticsId
    // };

    // const navEndEvents$ = this.router.events
    //   .pipe(
    //     filter(event => event instanceof NavigationEnd)
    //   );
    // navEndEvents$.subscribe((event: NavigationEnd) => {
    //   gtag('config', 'G-8SCFLYHJBQ', {
    //     page_path: event.urlAfterRedirects
    //   });
    // });

  }

  ngOnInit(): void {

    if (isPlatformBrowser(this.platformId)) {
      this.prepararCookieService();

    }
  }

  // no se están invocando, las libreias de tagmanager se incluyen en index.html
  // ----------------------------------------------
  // loadGoogleAnalytics(trackingID: string): void {

  //   const div = document.createElement('div');
  //   div.id = 'divGoogleAnalytics';

  //   const gaScript = document.createElement('script');
  //   gaScript.setAttribute('async', 'true');
  //   gaScript.setAttribute('src', `https://www.googletagmanager.com/gtag/js?id=${trackingID}`);

  //   const gaScript2 = document.createElement('script');
  //   gaScript2.innerText = `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag(\'js\', new Date());gtag(\'config\', \'${trackingID}\');`;

  //   div.appendChild(gaScript);
  //   div.appendChild(gaScript2);

  //   const head = document.getElementsByTagName('head')[0];
  //   head.insertBefore(div, head.firstChild);

  //   // document.getElementsByTagName('head')[0].appendChild(div);

  // }

  // // no se está invocando, se incluye en index.html
  //   removeGoogleAnalytics(divId: string): void {
  //     document.getElementById(divId).remove();
  //   }
  // ----------------------------------------------



  setTittleAndMetaTags(): void {
    this.titleService.setTitle(`Arte Fluido`);

    // Se ha tenido que excluir el metatag "descripción" debido a que en la renderización
    // en el servidor de universal, aparecía siempre esta etiqueda junto a la correspondiente
    // de cada página, es decir, se reflejaba dos veces en la página renderizada

    this.metaTagService.addTags([
      { name: 'keywords', content: 'lote, galeria, pedido, online, domicilio, recoger, cocina, galeria, calidad, precio, cerca' },
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: 'Arte Fluido' },

    ]);

    this.canonicalService.updateCanonicalUrl();

  }

  prepararCookieService(): void {

    // Support for translated cookies messages

    // this.translateService.addLangs(['en', 'es']);
    // this.translateService.setDefaultLang('en');

    // const browserLang = this.translateService.getBrowserLang();
    // this.translateService.use(browserLang.match(/en|es/) ? browserLang : 'en');

    this.translateService
      .get(['cookie.header', 'cookie.message', 'cookie.dismiss', 'cookie.allow', 'cookie.deny', 'cookie.link', 'cookie.policy'])
      .subscribe(data => {

        this.ccService.getConfig().content = this.ccService.getConfig().content || {};
        // Override default messages with the translated ones
        this.ccService.getConfig().content.header = data['cookie.header'];
        this.ccService.getConfig().content.message = data['cookie.message'];
        this.ccService.getConfig().content.dismiss = data['cookie.dismiss'];
        this.ccService.getConfig().content.allow = data['cookie.allow'];
        this.ccService.getConfig().content.deny = data['cookie.deny'];
        this.ccService.getConfig().content.link = data['cookie.link'];
        this.ccService.getConfig().content.policy = data['cookie.policy'];

        this.ccService.destroy(); // remove previous cookie bar (with default messages)
        this.ccService.init(this.ccService.getConfig()); // update config with translated messages

        if (this.ccService.hasConsented()) {
          this.cookiesOn()
        } else {
          this.cookiesOff()
        }

      });

    // subscribe to cookieconsent observables to react to main events
    this.popupOpenSubscription = this.ccService.popupOpen$.subscribe(
      () => {
        // you can use this.ccService.getConfig() to do stuff...

        // console.log('popupOpenSubscription');
        // console.log(this.ccService.getConfig());
      });

    this.popupCloseSubscription = this.ccService.popupClose$.subscribe(
      () => {
        // you can use this.ccService.getConfig() to do stuff...

        // console.log('popupCloseSubscription');

      });

    this.initializingSubscription = this.ccService.initializing$.subscribe(
      (event: NgcInitializingEvent) => {
        // the cookieconsent is initilializing... Not yet safe to call methods like `NgcCookieConsentService.hasAnswered()`
        console.log(`initializing: ${JSON.stringify(event)}`);
      });  

   
/*     this.initializeSubscription = this.ccService.initialize$.subscribe(
      (event:  NgcInitializingEvent) => {
        // you can use this.ccService.getConfig() to do stuff...

        // console.log('initializeSubscription');

      }); */
    
    this.initializedSubscription = this.ccService.initialized$.subscribe(
      () => {
        // the cookieconsent has been successfully initialized.
        // It's now safe to use methods on NgcCookieConsentService that require it, like `hasAnswered()` for eg...
        console.log(`initialized: ${JSON.stringify(event)}`);
      });

    this.initializationErrorSubscription = this.ccService.initializationError$.subscribe(
      (event: NgcInitializationErrorEvent) => {
        // the cookieconsent has failed to initialize... 
        console.log(`initializationError: ${JSON.stringify(event.error?.message)}`);
      });
   
    this.statusChangeSubscription = this.ccService.statusChange$.subscribe(
      (event: NgcStatusChangeEvent) => {

        // if (event.status === 'deny') {
        //   // this.cookiesDetalle(this.cookieParams);
        //   console.log('hasConsented:');
        //   console.log(this.ccService.hasConsented());

        //   if (isPlatformBrowser(this.platformId)) {
        //     window.dataLayer.push({ event: 'cookieNoOK' });
        //     this.deleteCookies();
        //   }
        //   // this.ccService.close(false);
        // } else {
        //   if (event.status === 'allow') {
        //     // window['dataLayer'].push({cookiesSet: true});
        //     if (isPlatformBrowser(this.platformId)) {
        //       window.dataLayer.push({ event: 'cookieOK' });
        //     }
        //   }
        // }



        if (isPlatformBrowser(this.platformId)) {
          console.log(`ccService.hasConsented()=${this.ccService.hasConsented()}`);
          console.log(`event.status=${event.status}`);

          switch (event.status) {
          case 'allow': {
            this.cookiesOn();
            break;
          }
          case 'deny': {
            this.cookiesOff();
            break;
          }

          default: {
            console.log('event.status <> allow y de deny');
            break;
          }
        }
      }

      });

    this.revokeChoiceSubscription = this.ccService.revokeChoice$.subscribe(
      () => {
        // you can use this.ccService.getConfig() to do stuff...

        // console.log('revokeChoiceSubscription');

      });

    this.noCookieLawSubscription = this.ccService.noCookieLaw$.subscribe(
      (event: NgcNoCookieLawEvent) => {
        // you can use this.ccService.getConfig() to do stuff...

        // console.log('noCookieLawSubscription');

      });

  }

  cookiesOn(): void {
    console.log('push=cookieOK');
    window.dataLayer.push({ event: 'cookieOK' });
  }

  cookiesOff(): void {
    console.log('push=cookieNoOK');
    window.dataLayer.push({ event: 'cookieNoOK' });
    this.deleteCookies();

  }


  deleteCookies(): void {
    document.cookie = `_ga=; Path=/; Domain=${environment.domain}; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    document.cookie = `_ga_${environment.googleAnalyticsId}=; Path=/; Domain=${environment.domain}; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  }

  // de momento no se está invocando
  public cookiesDetalle(cookieParams: CookieParams): void {
    this.modalConModeloService.openModalScrollable(
      CookieDetalleComponent,
      { size: 'lg', backdrop: 'static', scrollable: true, centered: true, keyboard: false },
      cookieParams,
      'cookiParams',
      'Los campos con * son obligatorios',
      'Datos del sugerencia'
    ).pipe(
      take(1) // take() manages unsubscription for us
    ).subscribe(result => {
      console.log({ confirmedResult: result });

      // this.sugerenciaService.getSugerencias(this.filtroSugerencia).subscribe(respon => {
      //     this.sugerencias = respon.content as Sugerencia[];
      //     this.paginador = respon;

      //         });
    });
  }

  getEmpresa(id: number): void {
    this.observ$ = this.empresaService.get(id).pipe(
      takeUntil(this.unsubscribe$)
    )
      .subscribe(
        json => {
          this.empresa = json;
          if (isPlatformBrowser(this.platformId)) {
            this.setTittleAndMetaTags();
          }
          // this.carritoService.cargaCarrito();
          this.shareEmpresaService.updateEmpresaMsg(this.empresa);
          console.log('enviado cambio datos empresa');
        }
        , err => this.showErrorService.httpErrorResponse(err, 'Carga datos de empresa', '', 'error')
      );
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy (), realizando unsubscribes');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    if (this.observ$ != null && !this.observ$.closed) {
      console.log('haciendo : this.observ$.unsubscribe()');
      this.observ$.unsubscribe();
    } else {
      console.log('No necesario hacer: this.observ$.unsubscribe()');
    }
    // unsubscribe to cookieconsent observables to prevent memory leaks

    if (isPlatformBrowser(this.platformId)) {

/*       this.popupOpenSubscription.unsubscribe();
      this.popupCloseSubscription.unsubscribe();
      this.initializeSubscription.unsubscribe();
      this.statusChangeSubscription.unsubscribe();
      this.revokeChoiceSubscription.unsubscribe();
      this.noCookieLawSubscription.unsubscribe();
 */

          // unsubscribe to cookieconsent observables to prevent memory leaks
    this.popupOpenSubscription.unsubscribe();
    this.popupCloseSubscription.unsubscribe();
    this.initializingSubscription.unsubscribe();
    this.initializedSubscription.unsubscribe();
    this.initializationErrorSubscription.unsubscribe();
    this.statusChangeSubscription.unsubscribe();
    this.revokeChoiceSubscription.unsubscribe();
    this.noCookieLawSubscription.unsubscribe();
    }
  }
}


