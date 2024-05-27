import { Component, EventEmitter, Inject, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { HttpParams } from '@angular/common/http';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthService } from '../../usuarios/auth.service';
import { CarritoService } from 'src/app/pages-store/carrito/carrito.service';
import { isPlatformBrowser } from '@angular/common';
import { environment } from 'src/environments/environment';

interface SubLote {
    routLink: string;
    key: string;
    class: string;
    keyView: string;
  }

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})


export class SidebarComponent implements OnInit {
    isActive: boolean;
    collapsed: boolean;
    showLote: string;
    pushRightClass: string;
    private observ$: Subscription = null;
    private unsubscribe$ = new Subject<void>();

    public hiddenProductosEnCarrito = false;
    public numArticulosCarrito = 0;
    public subscripcionNumArticulosEnCarrito: Subscription;


    @Output() collapsedEvent = new EventEmitter<boolean>();

    metaRestaurante: string = environment.urlMetaRestaurante;

  constructor(
    private translate: TranslateService,
    public router: Router,
    public authService: AuthService,
    public carritoService: CarritoService,
    @Inject(PLATFORM_ID) private platformId: string


  ) {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd &&
        isPlatformBrowser(this.platformId) &&
        window.innerWidth <= 992 && this.isToggled()) {
        this.toggleSidebar();
      }
    });
  }

    ngOnInit(): void {
        this.isActive = false;
        this.collapsed = false;
        this.showLote = '';
        this.pushRightClass = 'push-right';
        this.subscripcionNumArticulosEnCarrito = this.carritoService.getNumArticulosCarritoMsg()
        .subscribe(num => {
            console.log('recibido cambios datos carrito, numArticulos= ' + num);
            this.numArticulosCarrito = num;
        });
    }

    eventCalled(): void {
        this.isActive = !this.isActive;
    }

    addExpandClass(element: any): void {
        if (element === this.showLote) {
            this.showLote = '0';
        } else {
            this.showLote = element;
        }
    }

    // toggleCollapsed() {
    //     this.collapsed = !this.collapsed;
    //     console.log(`se emite evento collapsedEvent a ${this.collapsed}`);
    //     this.collapsedEvent.emit(this.collapsed);
    // }

    isToggled(): boolean {
      if (isPlatformBrowser(this.platformId)) {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
      }
    }

    toggleSidebar(): void {
      if (isPlatformBrowser(this.platformId)) {

        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
      }
    }

    rltAndLtr(): void {
      if (isPlatformBrowser(this.platformId)) {

        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
      }
    }

    changeLang(language: string): void {
        this.translate.use(language);
    }

    onLoggedout(): void {
        // localStorage.removeItem('isLoggedin');
        this.authService.logout();
        this.router.navigate(['\dashboard']);
    }
    onSelectAll(items: any): void {
    }
  }
