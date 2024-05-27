import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarritoComponent } from './carrito/carrito.component';
import { TramitarCarritoComponent } from './carrito/tramitar-carrito/tramitar-carrito.component';
import { GaleriaComponent } from './galeria/galeria.component';
import { LoteComponent } from './lote/lote.component';


const routes: Routes = [

  {
    path: 'galeria', component: GaleriaComponent,
  }
  ,
  {
    path: 'lote', component: LoteComponent,
  },
  {
    path: 'carrito', component: CarritoComponent,
    // children: [

    //   { path: 'tramitar/:idCarrito', component: TramitarCarritoComponent},
    // ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesStoreRoutingModule { }
