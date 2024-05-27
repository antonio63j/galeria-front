import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';


import { PaginatorComponent } from './paginator.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MatSelectModule,
        
        FormsModule
    ],
    declarations: [PaginatorComponent],
    exports: [PaginatorComponent]
})
export class PaginatorModule {

}
