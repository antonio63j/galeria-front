import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../usuarios/login/login.component';
import { PerfilComponent } from '../usuarios/perfil/perfil.component';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
    {
        path: '', component: DashboardComponent,
        children: [
            {
              path: 'login', loadChildren: () => import('../usuarios/login/login.module').then((m) => m.LoginModule)
            },
            {
              path: 'registro', loadChildren: () => import('../usuarios/signup/signup.module').then((m) => m.SignupModule)
            }

        ],

    },
    // {
    //   path: 'perfil', component: PerfilComponent,

    // }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }
