import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRolesComponent } from './admin-roles.component';
import { TranslateModule } from '@ngx-translate/core';
import { AdminRolesRoutingModule } from './admin-roles.routing';

@NgModule({
  imports: [CommonModule, TranslateModule, AdminRolesRoutingModule],
  declarations: [AdminRolesComponent]
})
export class AdminRolesModule { }
