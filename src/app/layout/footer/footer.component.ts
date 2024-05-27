import { Component, OnDestroy, OnInit } from '@angular/core';
import { ShareEmpresaService } from '../../shared/services/share-empresa.service';
import { Empresa } from '../../shared/modelos/empresa';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/usuarios/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {

  public empresa: Empresa = new Empresa();
  public subscription: Subscription;


  constructor(
    public shareEmpresaService: ShareEmpresaService,
    public  authService: AuthService) {

  }

  ngOnInit(): void {
    this.subscription = this.shareEmpresaService.getEmpresaMsg()
    .subscribe(msg => {
        console.log('recibido cambio datos empresa');
        this.empresa = msg;
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // onDestroy cancels the subscribe request
  }

}
