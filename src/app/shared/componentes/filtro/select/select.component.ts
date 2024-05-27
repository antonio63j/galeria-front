import { Component, OnInit } from "@angular/core";
import { UntypedFormGroup } from "@angular/forms";
import { FieldConfig } from "../field.interface";
@Component({
  selector: "app-select",
  template: `
<mat-form-field [class]="field.class" [formGroup]="group">
<mat-select [placeholder]="field.label" [formControlName]="field.name">
<mat-option *ngFor="let item of field.options"
  [value]="item.value">{{item.viewValue}}</mat-option>
</mat-select>
</mat-form-field>
`,
  styleUrls: ['../style.scss']
})
export class SelectComponent implements OnInit {
  field: FieldConfig;
  group: UntypedFormGroup;
  constructor() {}
  ngOnInit() {}
}
