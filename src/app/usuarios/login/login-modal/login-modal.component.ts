import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, Location } from '@angular/common';
import { AuthService } from '../../auth.service';
import { Usuario } from '../../../shared/modelos/usuario';
import Swal from  'sweetalert2';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../../shared/services/modal.service';
import { Router } from '@angular/router';
import { CarritoService } from 'src/app/pages-store/carrito/carrito.service';
import { ShowErrorService } from 'src/app/shared/services/show-error.service';


@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})

export class LoginModalComponent implements OnInit, OnDestroy, AfterViewInit {
  public usuario: Usuario = new Usuario();
  public titulo = 'Inicio de sesión';
  public hide = true;
  @ViewChild ('emailCuenta') emailCuenta: ElementRef;

  constructor(
    public authService: AuthService,
    public activeModal: NgbActiveModal,
    private modalService: ModalService,
    private location: Location,
    private router: Router,
    private carritoService: CarritoService,
    private showErrorService: ShowErrorService,
    @Inject(PLATFORM_ID) private platformId: string

  ) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    Promise.resolve(null).then(() => this.emailCuenta.nativeElement.focus());
    

  }

  login(): void {


    this.authService.login(this.usuario).subscribe(
      response => {
        this.authService.guardarUsuario(response.access_token);
        this.authService.guardarToken(response.access_token);
        const usuario = this.authService.usuario;
        // console.log(`login con éxito de ${usuario.username}`);
        this.carritoService.cargaCarrito();

        this.modalService.eventoCerrarModalScrollable.emit();
      },
      err => {
        if (err.status === 400) {
          console.log(err);
          Swal.fire('Error Login', 'Usuario o password incorrectas o cuenta no activada!', 'error');
        } else {this.showErrorService.httpErrorResponse(err, 'Error login', '', 'error');
        }
      }
    );
    return;
  }

  resetPassword(): void {
    // this.modalService.eventoCerrarModalScrollable.emit();
    this.activeModal.close('resetPassword');
  }

  signup(): void {
    this.activeModal.close('signup');
  }

  ngOnDestroy(): void {
    console.log('en ngOnDestroy()');
    if (this.authService.hasRole('ROLE_ADMIN')) {
      this.router.navigate(['\admin-index']);
    } else {
      if (isPlatformBrowser(this.platformId)) {
        this.location.back();
      }
    }
  }
}
