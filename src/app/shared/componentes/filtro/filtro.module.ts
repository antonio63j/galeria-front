import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltroComponent } from './filtro.component';
import { InputComponent } from './input/input.component';
import { ButtonComponent } from './button/button.component';
import { SelectComponent } from './select/select.component';

import { DateComponent } from './date/date.component';
import { DateRangeComponent } from './date-range/date-range.component';

import { RadiobuttonComponent } from './radiobutton/radiobutton.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { DynamicFieldDirective } from './dynamic-field/dynamic-field.directive';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { TimeComponent } from './time/time.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [
        FiltroComponent,
        InputComponent,
        ButtonComponent,
        SelectComponent,
        DateComponent,
        RadiobuttonComponent,
        CheckboxComponent,
        DateRangeComponent,
        TimeComponent,
        DynamicFieldDirective,
        DynamicFormComponent
    ],
    imports: [
        CommonModule,
        // BrowserAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatListModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        MatOptionModule,
        MatCheckboxModule,
        MatRadioModule,
        NgxMaterialTimepickerModule,
        TranslateModule
    ],
    exports: [
        DynamicFieldDirective,
        DynamicFormComponent
    ],
    providers: []
})

export class FiltroModule { }
