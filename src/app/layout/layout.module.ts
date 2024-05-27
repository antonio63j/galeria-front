
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from '../layout/header/header.component';
import { SidebarComponent } from '../layout/sidebar/sidebar.component';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { FooterComponent } from './footer/footer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PaginatorComponent } from '../shared/componentes/paginator/paginator.component';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';


@NgModule({
    imports: [CommonModule,
        LayoutRoutingModule,
        TranslateModule,
        NgbModule,
        MatIconModule,
        MatBadgeModule

    ],
    declarations: [LayoutComponent,
        SidebarComponent,
        HeaderComponent,
        FooterComponent
    ],
})
export class LayoutModule { }
