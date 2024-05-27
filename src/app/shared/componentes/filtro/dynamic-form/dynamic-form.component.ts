import { formatCurrency } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import { FieldConfig, Validator } from '../field.interface';

@Component({
  exportAs: "dynamicForm",
  selector: "dynamic-form",
  template: `
  <form class="dynamic-form" [formGroup]="form" (submit)="onSubmit($event)">
  <ng-container *ngFor="let field of fields;" dynamicField [field]="field" [group]="form">
  </ng-container>
  </form>
  `,
  styleUrls: ['../style.scss']
})
export class DynamicFormComponent implements OnInit {
  @Input() fields: FieldConfig[] = [];

  @Output() submit: EventEmitter<any> = new EventEmitter<any>();

  form: UntypedFormGroup;

  get value() {
    return this.form.value;
  }
  constructor(private fb: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.form = this.createControl();
    this.onValueChanges();
  }

  onSubmit(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.form.valid) {
      this.submit.emit(this.form.value);
      // console.log('form.valid');
    } else {
      this.validateAllFormFields(this.form);
      console.log('!form.valid');
    }
  }


  createControl() {
    const group = this.fb.group({});
    this.fields.forEach(field => {

      console.log(`field: ${JSON.stringify(field)}`);

      if (field.type === 'button') { return; }

      if (field.type === 'daterange') {
        // group.addControl(field.nameIni, control);
        // group.addControl(field.nameFin, control);
        const controlIni = this.fb.control(
          field.valueDateIni, this.bindValidations(field.validations || []));
        group.addControl(field.nameIni, controlIni);
        const controlFin = this.fb.control(
          field.valueDateFin, this.bindValidations(field.validations || []));
        group.addControl(field.nameFin, controlFin);

      } else {
        const control = this.fb.control(
          field.value, this.bindValidations(field.validations || [])
        );
        group.addControl(field.name, control);
      }
    });
    return group;
  }


  createControl_old() {
    const group = this.fb.group({});
    this.fields.forEach(field => {

      console.log(`field: ${JSON.stringify(field)}`);

      if (field.type === 'button') { return; }
      const control = this.fb.control(
        field.value, this.bindValidations(field.validations || [])
      );
      if (field.type === 'daterange') {
        // group.addControl(field.nameIni, control);
        // group.addControl(field.nameFin, control);

      } else {
        group.addControl(field.name, control);
      }
    });
    return group;
  }

  bindValidations(validations: any) {
    if (validations.length > 0) {
      const validList = [];
      validations.forEach(valid => {
        validList.push(valid.validator);
      });
      return Validators.compose(validList);
    }
    return null;
  }

  validateAllFormFields(formGroup: UntypedFormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }

  onValueChanges(): void {
    this.form.valueChanges.subscribe(val => {
      // this.submit.emit(this.form.value);

    });
  }
}
