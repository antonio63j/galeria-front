import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminIndexComponent } from '../pages-admin/admin-index/admin-index.component';
import { GaleriaComponent } from '../pages-store/galeria/galeria.component';
import { LoteComponent } from '../pages-store/lote/lote.component';
import { RoleGuard } from '../usuarios/guards/role.guard';

import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
      path: '', component: LayoutComponent,
      children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
          { path: 'dashboard', loadChildren: () => import('../dashboard/dashboard.module').then((m) => m.DashboardModule)},

          { path: 'perfil', loadChildren: () => import ('../usuarios/perfil/perfil.module').then ((m) => m.PerfilModule)},

          { path: 'contacto', loadChildren: () => import('../pages-store/contacto/contacto.module').then((m) => m.ContactoModule)},

          { path: 'admin-index',  canActivate: [RoleGuard], data: {role: 'ROLE_ADMIN'},
            loadChildren: () => import('../pages-admin/pages-admin.module').then((m) => m.PagesAdminModule) },
          { path: 'store',
            loadChildren: () => import('../pages-store/pages-store.module').then((m) => m.PagesStoreModule) },

      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
