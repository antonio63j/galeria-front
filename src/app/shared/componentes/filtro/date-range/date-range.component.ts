import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FieldConfig } from '../field.interface';
@Component({
  selector: 'app-date-range',
  template: `
  <mat-form-field class="demo-full-width margin-top" [formGroup]="group">
  <mat-label>{{field.label}}</mat-label>
  <mat-date-range-input
    [rangePicker]="picker"
    [comparisonStart]="field.valueDateIni"
    [comparisonEnd]="field.valueDateFin">
    <input matStartDate [formControlName]="field.nameIni" placeholder="Start date">
    <input matEndDate [formControlName]="field.nameFin" placeholder="End date">
  </mat-date-range-input>
  <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
  <mat-date-range-picker #picker></mat-date-range-picker>

  <ng-container *ngFor="let validation of field.validations;" ngProjectAs="mat-error">
  <mat-error *ngIf="group.get(field.name).hasError(validation.name)">{{validation.message}}</mat-error>
  </ng-container>
  </mat-form-field>
`,
  styles: []
})
export class DateRangeComponent implements OnInit {
  field: FieldConfig;
  group: UntypedFormGroup;
  constructor() {}
  ngOnInit(): void {}
}
