import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminIndexComponent } from './admin-index/admin-index.component';
import { AdminLoteSugerenciaComponent } from './admin-lote-sugerencia/admin-lote-sugerencia.component';
import { AdminLoteComponent } from './admin-lote/admin-lote.component';
import { AdminPedidoFormComponent } from './admin-pedido/admin-pedido-form/admin-pedido-form.component';
import { AdminPedidoComponent } from './admin-pedido/admin-pedido.component';
import { AdminSlidersComponent } from './admin-sliders/admin-sliders.component';
import { AdminSugerenciaComponent } from './admin-sugerencia/admin-sugerencia.component';
import { AdminTiposugerenciaComponent } from './admin-tipoobra/admin-tipoobra.component';
import { EmpresaComponent } from './empresa/empresa.component';

const routes: Routes = [
  {
    path: '', component: AdminIndexComponent,
  }
  ,
  {
    path: 'empresa', component: EmpresaComponent,
  }
  ,
  {
    path: 'admhome', component: AdminHomeComponent,
  }
  ,
  {
    path: 'admslider', component: AdminSlidersComponent,
  },
  {
    path: 'admtipoobra', component: AdminTiposugerenciaComponent,
  },
  {
    path: 'admsugerencia', component: AdminSugerenciaComponent,
  },

  {
    path: 'admlote', component: AdminLoteComponent,
  },

  {
    path: 'admlotesugerencia/:id', component: AdminLoteSugerenciaComponent,
  },

  {
    path: 'admpedido', component: AdminPedidoComponent,
  },

  {
    path: 'admpedidoform/:pedidoId', component: AdminPedidoFormComponent,
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesAdminRoutingModule { }
