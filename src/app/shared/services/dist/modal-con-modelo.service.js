"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ModalConModeloService = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var ModalConModeloService = /** @class */ (function () {
    function ModalConModeloService(ngbModal) {
        this.ngbModal = ngbModal;
    }
    ModalConModeloService.prototype.openModalScrollable = function (componente, configuracion, modelo, modeloNombreEnModal, prompt, title) {
        if (prompt === void 0) { prompt = 'Really?'; }
        if (title === void 0) { title = 'Confirm'; }
        this.modal = this.ngbModal.open(componente, configuracion);
        this.modal.componentInstance[modeloNombreEnModal] = modelo;
        this.modal.componentInstance.prompt = prompt;
        this.modal.componentInstance.title = title;
        return rxjs_1.from(this.modal.result).pipe(operators_1.catchError(function (error) {
            console.error(error);
            return rxjs_1.of(undefined);
        }));
    };
    ModalConModeloService.prototype.closeModalScrollable = function () {
        this.modal.close();
    };
    ModalConModeloService.prototype.ngOnDestroy = function () {
        console.log('En ngOnDestroy()');
    };
    ModalConModeloService = __decorate([
        core_1.Injectable()
    ], ModalConModeloService);
    return ModalConModeloService;
}());
exports.ModalConModeloService = ModalConModeloService;
