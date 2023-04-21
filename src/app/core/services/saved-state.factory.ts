import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Factory } from './factory';
import { SavedState } from '../models/saved-state.model';


@Injectable({
    providedIn: 'root'
})
export class SavedStateFactory extends Factory<SavedState> {
  protected readonly endpoint: string = 'saved-states';

  constructor() {
    super(SavedState)
  }

}
