import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FieldConfig } from '../field.interface';

import * as mySettings from '../../../settings/ngx-material-timepicker';

@Component({
  selector: 'app-time',
  template: `
  <div [class]="field.class" [formGroup]="group"  style="display: inline-block">
  <mat-label style="font-size: 12px;">{{field.label}}</mat-label>
  <ngx-timepicker-field [format]="24" [clockTheme]="oktTheme"
    #myPickerRef [confirmBtnTmpl]="confirmBtn"
    [formControlName]="field.name"
    [cancelBtnTmpl]="cancelBtn">
  </ngx-timepicker-field>


  
  <ng-container *ngFor="let validation of field.validations;" ngProjectAs="mat-error">
  <mat-error *ngIf="group.get(field.name).hasError(validation.name)">{{validation.message}}</mat-error>
  </ng-container>
  </div>

  <ng-template #cancelBtn>
    <button mat-stroked-button color="success" style="margin-right: 7px">{{'Cancelar'
      | translate}}</button>
  </ng-template>
  <ng-template #confirmBtn>
    <button mat-stroked-button color="success" style="margin-right: 7px">{{'Confirmar'
      | translate}}</button>
  </ng-template>
`,
styleUrls: ['../style.scss']
})
export class TimeComponent implements OnInit {
  field: FieldConfig;
  group: UntypedFormGroup;
  public oktTheme = mySettings.timeSettings;
  constructor() {}
  ngOnInit(): void {}
}