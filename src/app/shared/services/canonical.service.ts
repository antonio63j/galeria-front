import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { isPlatformServer } from '@angular/common';


@Injectable({
  providedIn: 'root'
})

export class CanonicalService {

  constructor(
    @Inject(DOCUMENT) private dom: any,
    @Inject(PLATFORM_ID) private platformId: string

    ) { }

  // setCanonicalURL(url?: string): void {
  //   if (isPlatformServer(this.platformId)) {
  //     return;
  //   }
  //   const canURL = url === undefined ? this.dom.URL : url;
  //   const link: HTMLLinkElement = this.dom.createElement('link');
  //   link.setAttribute('rel', 'canonical');
  //   this.dom.head.appendChild(link);
  //   link.setAttribute('href', canURL);
  // }

  updateCanonicalUrl(url?: string): void{
    if (isPlatformServer(this.platformId)) {
      return;
    }
    const canURL = url === undefined ? this.dom.URL : url;
    const head = this.dom.getElementsByTagName('head')[0];
    let element: HTMLLinkElement = this.dom.querySelector(`link[rel='canonical']`) || null;
    if (element === null) {
      element = this.dom.createElement('link') as HTMLLinkElement;
      head.appendChild(element);
    }
    element.setAttribute('rel', 'canonical');
    element.setAttribute('href', canURL);
  }

}