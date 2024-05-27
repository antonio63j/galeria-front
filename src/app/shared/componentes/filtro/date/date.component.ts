import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FieldConfig } from '../field.interface';
@Component({
  selector: 'app-date',
  template: `
<mat-form-field class="demo-full-width margin-top" [formGroup]="group">
<input matInput [matDatepicker]="picker" [formControlName]="field.name" [placeholder]="field.label">
<mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
<mat-datepicker #picker></mat-datepicker>

<ng-container *ngFor="let validation of field.validations;" ngProjectAs="mat-error">
<mat-error *ngIf="group.get(field.name).hasError(validation.name)">{{validation.message}}</mat-error>
</ng-container>
</mat-form-field>
`,
  styles: []
})
export class DateComponent implements OnInit {
  field: FieldConfig;
  group: UntypedFormGroup;
  constructor() {}
  ngOnInit() {}
}
