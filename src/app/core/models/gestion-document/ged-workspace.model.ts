import { IBase } from 'src/app/core/models/base.interface';
import { IJsonFormControl, JsonFormControl } from '../json-form/json-form-control';
import { hasManyMap } from 'src/app/shared/decorator/adapter/relation-map';
import { environment } from 'src/environments/environment';

export interface IGedWorkspace extends IBase {
 description: String;
 image: String;
 allowed_type: string;
 fullpath:string;
 structure_id: number;
 public: number;
 structure: any;
}

export class GedWorkspace implements IGedWorkspace {
    id: number = 0;
    libelle: string = '';
    description: string = '';
    image: string = '';
    allowed_type: string = '';
    structure_id: number = null;
    public: number = 1;
    structure: any = null;

    get fullpath() {
        return environment.storageUrl+this.image;
    }
}
