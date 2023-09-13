import { IBase } from 'src/app/core/models/base.interface';
import { IJsonFormControl, JsonFormControl } from '../json-form/json-form-control';
import { hasManyMap } from 'src/app/shared/decorator/adapter/relation-map';

export interface IGedDossierAdministratif extends IBase {
 description: String;
 structure_id: number;
 structure: any;
}

export class GedDossierAdministratif implements IGedDossierAdministratif {
    id: number = 0;
    libelle: string = '';
    description: string = '';
    structure_id: number = null;
    structure: any = null;
}
