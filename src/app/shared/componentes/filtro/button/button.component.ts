import { Component, OnInit } from "@angular/core";
import { UntypedFormGroup } from "@angular/forms";
import { FieldConfig } from "../field.interface";
@Component({
  selector: "app-button",
  template: `
<div class="demo-full-width margin-top" [formGroup]="group">
<button  mat-stroked-button color="success" type="submit">{{field.label}}</button>
</div>
`,
   styleUrls: ['../style.scss']
})
export class ButtonComponent implements OnInit {
  field: FieldConfig;
  group: UntypedFormGroup;
  constructor() {}
  ngOnInit() {}
}

// <button mat-button type="submit">{{field.label}}</button>
