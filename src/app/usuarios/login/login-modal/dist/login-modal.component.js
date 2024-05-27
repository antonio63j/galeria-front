"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.LoginModalComponent = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var usuario_1 = require("../../../shared/modelos/usuario");
var sweetalert2_1 = require("sweetalert2");
var LoginModalComponent = /** @class */ (function () {
    function LoginModalComponent(authService, activeModal, modalService, location, router, carritoService, showErrorService, platformId) {
        this.authService = authService;
        this.activeModal = activeModal;
        this.modalService = modalService;
        this.location = location;
        this.router = router;
        this.carritoService = carritoService;
        this.showErrorService = showErrorService;
        this.platformId = platformId;
        this.usuario = new usuario_1.Usuario();
        this.titulo = 'Inicio de sesión';
        this.hide = true;
    }
    LoginModalComponent.prototype.ngOnInit = function () {
    };
    LoginModalComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        Promise.resolve(null).then(function () { return _this.emailCuenta.nativeElement.focus(); });
    };
    LoginModalComponent.prototype.login = function () {
        var _this = this;
        this.authService.login(this.usuario).subscribe(function (response) {
            _this.authService.guardarUsuario(response.access_token);
            _this.authService.guardarToken(response.access_token);
            var usuario = _this.authService.usuario;
            // console.log(`login con éxito de ${usuario.username}`);
            _this.carritoService.cargaCarrito();
            _this.modalService.eventoCerrarModalScrollable.emit();
        }, function (err) {
            if (err.status === 400) {
                console.log(err);
                sweetalert2_1["default"].fire('Error Login', 'Usuario o password incorrectas o cuenta no activada!', 'error');
            }
            else {
                _this.showErrorService.httpErrorResponse(err, 'Error login', '', 'error');
            }
        });
        return;
    };
    LoginModalComponent.prototype.resetPassword = function () {
        // this.modalService.eventoCerrarModalScrollable.emit();
        this.activeModal.close('resetPassword');
    };
    LoginModalComponent.prototype.signup = function () {
        this.activeModal.close('signup');
    };
    LoginModalComponent.prototype.ngOnDestroy = function () {
        console.log('en ngOnDestroy()');
        if (this.authService.hasRole('ROLE_ADMIN')) {
            this.router.navigate(['\admin-index']);
        }
        else {
            if (common_1.isPlatformBrowser(this.platformId)) {
                this.location.back();
            }
        }
    };
    __decorate([
        core_1.ViewChild('emailCuenta')
    ], LoginModalComponent.prototype, "emailCuenta");
    LoginModalComponent = __decorate([
        core_1.Component({
            selector: 'app-login-modal',
            templateUrl: './login-modal.component.html',
            styleUrls: ['./login-modal.component.scss']
        }),
        __param(7, core_1.Inject(core_1.PLATFORM_ID))
    ], LoginModalComponent);
    return LoginModalComponent;
}());
exports.LoginModalComponent = LoginModalComponent;
