import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminIndexComponent } from './pages-admin/admin-index/admin-index.component';

const routes: Routes = [
    { path: '', loadChildren: () => import('./layout/layout.module').then((m) => m.LayoutModule) },
   // { path: 'admin-index', loadChildren: () => import('./pages-admin/login/login.module').then((m) => m.LoginModule) },
   // { path: 'admin-index', component: AdminIndexComponent},
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { enableTracing: false, initialNavigation: 'enabledBlocking' }) ,

             ],
    exports: [RouterModule
             ]
})
export class AppRoutingModule {}
