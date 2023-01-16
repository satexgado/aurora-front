import { OnInit } from '@angular/core';
import {
  Component,
  OnChanges,
  Input,
  ChangeDetectionStrategy,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

interface JsonFormValidators {
  min?: number;
  max?: number;
  required?: boolean;
  requiredTrue?: boolean;
  email?: boolean;
  minLength?: boolean;
  maxLength?: boolean;
  pattern?: string;
  nullValidator?: boolean;
}

interface JsonFormControlOptions {
  min?: string;
  max?: string;
  step?: string;
  icon?: string;
}

interface JsonFormControls {
  libelle: string;
  label: string;
  value: string;
  type: string;
  options?: JsonFormControlOptions;
  required: boolean|number;
  validators?: JsonFormValidators;
}

export interface JsonFormData {
  controls: JsonFormControls[];
}

@Component({
  selector: 'app-json-form2',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './json-form2.component.html',
})
export class JsonForm2Component implements OnChanges, OnInit {
  @Input() jsonFormData: JsonFormData;

  public myForm: FormGroup = this.fb.group({});

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.createForm(this.jsonFormData.controls);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.jsonFormData.firstChange) {
      this.createForm(this.jsonFormData.controls);
    }
  }

  createForm(controls: JsonFormControls[]) {
    this.myForm = this.fb.group({});

    for (const control of controls) {
      const validatorsToAdd = [];

      if(control.required) {
        validatorsToAdd.push(Validators.required);
      }

      if(control.validators) {
        for (const [key, value] of Object.entries(control.validators)) {
          switch (key) {
            case 'min':
              validatorsToAdd.push(Validators.min(value));
              break;
            case 'max':
              validatorsToAdd.push(Validators.max(value));
              break;
            case 'required':
              if (value) {
                validatorsToAdd.push(Validators.required);
              }
              break;
            case 'requiredTrue':
              if (value) {
                validatorsToAdd.push(Validators.requiredTrue);
              }
              break;
            case 'email':
              if (value) {
                validatorsToAdd.push(Validators.email);
              }
              break;
            case 'minLength':
              validatorsToAdd.push(Validators.minLength(value));
              break;
            case 'maxLength':
              validatorsToAdd.push(Validators.maxLength(value));
              break;
            case 'pattern':
              validatorsToAdd.push(Validators.pattern(value));
              break;
            case 'nullValidator':
              if (value) {
                validatorsToAdd.push(Validators.nullValidator);
              }
              break;
            default:
              break;
          }
        }

      }

      this.myForm.addControl(
        control.libelle,
        this.fb.control(control.value, validatorsToAdd)
      );
    }

    this.myForm.markAllAsTouched();
  }

  onSubmit() {
    console.log('Form valid: ', this.myForm.valid);
    console.log('Form values: ', this.myForm.value);
  }

  shouldShowError(field: string, errorType: string): boolean {
    const control = this.myForm.get(field);
    if (control?.touched && control.errors) {
      return control?.errors[errorType];
    }

    return false;
  }

  shouldDisableSubmit() {
    return (
      this.myForm.invalid
    );
  }

  getVal() {
   let result = this.jsonFormData;
   if(!result) {
    return null;
   }
   result.controls = this.jsonFormData.controls.map(
      (data)=> {
        data.value = this.myForm.get(data.libelle) ? this.myForm.get(data.libelle).value : '';
        return data;
      }
    );
    return  result;
  }

  isValid(field: string) {
    const control = this.myForm.get(field);
    // return control?.touched && control.valid;
    return  control.valid;
  }
}
