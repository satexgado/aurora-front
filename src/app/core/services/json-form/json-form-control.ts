import { JsonFormControl } from './../../models/json-form/json-form-control';
import { Injectable } from '@angular/core';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class JsonFormControlFactory extends Factory<JsonFormControl> {
  protected readonly endpoint: string = 'json-form/controls';

  constructor() {
    super(JsonFormControl)
  }

}
