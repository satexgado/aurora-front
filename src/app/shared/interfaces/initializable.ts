import { FormGroup } from '@angular/forms';

// TODO: utiliser le type de la classe generic
export interface Initializable<Type> {
  initialiseForm(element: Type | undefined): FormGroup;
}
