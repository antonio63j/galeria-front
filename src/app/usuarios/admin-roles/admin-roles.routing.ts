import { Routes, RouterModule } from '@angular/router';
import { AdminRolesComponent } from '../admin-roles/admin-roles.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
      path: '',
      component: AdminRolesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRolesRoutingModule {}
