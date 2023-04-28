import { IBase } from 'src/app/core/models/base.interface';
import { IJsonFormControl, JsonFormControl } from '../json-form/json-form-control';
import { hasManyMap } from 'src/app/shared/decorator/adapter/relation-map';

export interface IGedModele extends IBase {
 description: String;
 image: String;
 allowed_type: string;
 form_fields: IJsonFormControl[];
}

export class GedModele implements IGedModele {
    id: number = 0;
    libelle: string = '';
    description: string = '';
    image: string = '';
    allowed_type: string = '';

    @hasManyMap({class: JsonFormControl, field: 'cr_form_fields'})
    form_fields: IJsonFormControl[] = null;
}
