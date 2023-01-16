import { hasOneMap } from 'src/app/shared/decorator/adapter/relation-map';
import { IBase } from 'src/app/core/models/base.interface';
import { IJsonFormValidator, JsonFormValidator } from './json-form-validator';

export  enum JsonFormControlEnum {
  text = 'text',
  password = 'password',
  email = 'email',
  number = 'number',
  search = 'search',
  tel = 'tel',
  url = 'url',
  textarea = 'textarea',
  checkbox = 'checkbox',
  toggle = 'toggle',
  range = 'range'
}

export interface IJsonFormControl extends IBase {
  label: string;
  value: string;
  type: JsonFormControlEnum;
  required: number|boolean;
  validator: IJsonFormValidator;
}

export class JsonFormControl implements IJsonFormControl {
    id: number = 0;
    libelle: string = '';
    label: string = '';
    value: string = '';
    type: JsonFormControlEnum = JsonFormControlEnum.text;
    required: number|boolean = 1;
    @hasOneMap({field: 'cr_form_field_validator', class: JsonFormValidator})
    validator: IJsonFormValidator = null;
}
