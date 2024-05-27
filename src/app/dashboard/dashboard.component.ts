import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { Slider } from '../shared/modelos/slider';
import { AdminSliderService } from '../pages-admin/admin-sliders/admin-slider.service';
import { routerTransition } from '../router.animations';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { ShareEmpresaService } from '../shared/services/share-empresa.service';
import { Empresa } from '../shared/modelos/empresa';
import { isPlatformBrowser } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { CanonicalService } from '../shared/services/canonical.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [routerTransition()]
})
export class DashboardComponent implements OnInit, OnDestroy {
  // public alerts: Array<any> = [];
  // public sliders: Array<any> = [];
  // public utilidades: Array<any> = [];

  public sliders: Slider[];

  private unsubscribe$ = new Subject<void>();
  // public host: string = environment.urlEndPoint;
  public loading: boolean;
  public subscription: Subscription;
  public empresa: Empresa = new Empresa();

  constructor(
    private sliderService: AdminSliderService,
    public shareEmpresaService: ShareEmpresaService,
    @Inject(PLATFORM_ID) private platformId: string,
    private titleService: Title,
    private metaTagService: Meta,
    private canonicalService: CanonicalService
  ) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.subscription = this.shareEmpresaService.getEmpresaMsg().pipe(
      takeUntil(this.unsubscribe$))
      .subscribe(msg => {
        console.log('recibido cambio datos empresa');
        this.empresa = msg;
        this.updateTitleAndMetaTags();
      });
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }

  updateTitleAndMetaTags(): void {
    this.titleService.setTitle(`${this.empresa.nombre} tu galeria en ${this.empresa.localidad} (${this.empresa.provincia}) | pedidos online`);
    // this.metaTagService.updateTag({name: 'keywords', content: 'cocina, pedidos,
    // galeria, tradicional, calidad, buen precio, lotes , galeria, pedidos, online'});

    this.metaTagService.updateTag({
      name: 'description', content: `${this.empresa.nombre} tu galeria en ${this.empresa.localidad} (${this.empresa.provincia}), \
cocinamos con productos de primera calidad, principalmente de temporada, \
elabora tu pedido online entre diferentes lotes o a la galeria, \
es posible entregar los pedidos a domicilio o recogida en el propio galeria`}, `name='description'`);

    this.canonicalService.updateCanonicalUrl(environment.domainUrl);

  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy (), realizando unsubscribes');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
