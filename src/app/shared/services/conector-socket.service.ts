import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { AuthService } from 'src/app/usuarios/auth.service';
import { environment } from '../../../environments/environment';
import { Subject, Subscription } from 'rxjs';
import { Empresa } from '../modelos/empresa';
import { EmpresaService } from 'src/app/pages-admin/empresa/empresa.service';
import { ShareEmpresaService } from './share-empresa.service';
import { takeUntil } from 'rxjs/operators';
import { ShowErrorService } from './show-error.service';
import { isPlatformBrowser } from '@angular/common';
import { isPlatformServer } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ConectorSocketService {

  mensaje: string;
  mensajeOut: string;

  webSocketEndPoint: string = environment.urlEndPoint + '/wsocket1';
  topic = '/topic/datosEmpresa';
  private stompClient: any;
  private ws: any;
  connected = false;

  private observ$: Subscription = null;
  private unsubscribe$ = new Subject<void>();
  empresa: Empresa;


  constructor(
    public authService: AuthService,
    private showErrorService: ShowErrorService,
    private empresaService: EmpresaService,
    private shareEmpresaService: ShareEmpresaService,
    @Inject(PLATFORM_ID) private platformId: string

  ) {
  }

  connect(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }
    this.ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(this.ws);

    const header = {
      login: 'mylogin',
      passcode: 'mypasscode',
      // additional header
      'client-id': 'my-client-id'
    };

    this.stompClient.connect({ header },
      ((frame: any) => {
        this.okCallBackConnect(frame);
      })
      ,
      ((error: any) => {
        this.errorCallBackConnect(error);
      })
    );
  }

  disconnect(): void {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log('Disconnected');
  }

  subscribe(): void {
    this.stompClient.subscribe(this.topic,
      ((sdkEvent: any) => {
        this.onMessageReceived(sdkEvent);
      })
    );
  }

  sendMessage(): void {
    // this.stompClient.send('/app/hello', {}, JSON.stringify(this.name));
    this.stompClient.send('/app/hello', {}, JSON.stringify(this.mensajeOut));
  }

  onMessageReceived(message: any): void {
    console.log('onMessageReceive:');
    console.log(message);
    // this.mensaje = JSON.parse(message.body).content;
    this.mensaje = message.body;

    this.shareEmpresaService.updateEmpresaMsg(JSON.parse(this.mensaje));
    console.log(JSON.parse(this.mensaje));
  }

  public okCallBackConnect(frame: any): void {
    console.log('frame:');
    console.log(frame);
    this.connected = true;
    this.subscribe();
    this.getEmpresa (1);
  }

  errorCallBackConnect(error: string): void {
    this.connected = false;
    console.log('errorCallBackConnect -> ' + error);
    setTimeout(() => {
      this.connect();
    }, 5000);
  }

  getEmpresa(id: number): void {
    this.observ$ = this.empresaService.get(id).pipe(
      takeUntil(this.unsubscribe$)
    )
      .subscribe(
        json => {
          this.empresa = json;
          // this.carritoService.cargaCarrito();
          this.shareEmpresaService.updateEmpresaMsg(this.empresa);
          console.log('enviado cambio datos empresa');
        }
        , err => this.showErrorService.httpErrorResponse(err, 'Carga datos de empresa', '', 'error')
      );
  }

}
