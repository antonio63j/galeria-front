import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

import { SignupRoutingModule } from './signup-routing.module';
import { SignupModalComponent } from './signup-modal/signup-modal.component';
import { SignupComponent } from './signup.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
    imports: [CommonModule,
        TranslateModule,
        SignupRoutingModule,
        FormsModule,

        MatIconModule,

        MatInputModule,
        MatButtonModule,
        MatFormFieldModule,
        MatCheckboxModule

    ],
    declarations: [
        SignupComponent,
        SignupModalComponent
    ],
    exports: [
        SignupModalComponent
    ]
})
export class SignupModule {}
