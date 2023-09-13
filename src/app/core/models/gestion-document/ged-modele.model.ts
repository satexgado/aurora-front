import { IBase } from 'src/app/core/models/base.interface';
import { IJsonFormControl, JsonFormControl } from '../json-form/json-form-control';
import { hasManyMap } from 'src/app/shared/decorator/adapter/relation-map';
import { environment } from 'src/environments/environment';

export interface IGedModele extends IBase {
 description: String;
 image: String;
 allowed_type: string;
 form_fields: IJsonFormControl[];
 fullpath:string;
 structure_id: number;
 active: number;
 structure: any;
}

export class GedModele implements IGedModele {
    id: number = 0;
    libelle: string = '';
    description: string = '';
    image: string = '';
    allowed_type: string = '';
    structure_id: number = null;
    active: number = 1;
    structure: any = null;

    @hasManyMap({class: JsonFormControl, field: 'ged_modele_form_fields'})
    form_fields: IJsonFormControl[] = null;

    get fullpath() {
        return environment.storageUrl+this.image;
    }
}
