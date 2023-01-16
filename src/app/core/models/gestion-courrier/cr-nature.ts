import { IBase } from 'src/app/core/models/base.interface';
import { hasManyMap } from 'src/app/shared/decorator/adapter/relation-map';
import { IJsonFormControl, JsonFormControl } from '../json-form/json-form-control';

export interface ICrNature extends IBase {
  description: string;
  form_fields: IJsonFormControl[];
}

export class CrNature implements ICrNature {
    id: number = 0;
    libelle: string = '';
    description: string = '';

    @hasManyMap({class: JsonFormControl, field: 'cr_form_fields'})
    form_fields: IJsonFormControl[] = null;
}
