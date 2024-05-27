export interface Validator {
  name: string;
  validator: any;
  message: string;
}

export interface OpcionesSelect {
  value: string;
  viewValue: string;
}

export interface FieldConfig {
  label?: string;
  name?: string;
  inputType?: string;
  class?: string;
  options?: OpcionesSelect[];
  collections?: any;
  type: string;
  value?: any;
  valueDateIni?: Date;
  valueDateFin?: Date;

  validations?: Validator[];

  nameIni?: string;
  nameFin?: string;
  // valueIni?: string;
  // valueFin?: string;
}
