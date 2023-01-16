import { JsonFormValidator } from './../../models/json-form/json-form-validator';
import { Injectable } from '@angular/core';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class JsonFormValidatorFactory extends Factory<JsonFormValidator> {
  protected readonly endpoint: string = 'json-form/validators';

  constructor() {
    super(JsonFormValidator)
  }

}
