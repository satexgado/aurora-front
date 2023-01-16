import { GedElement, IGedElement } from './ged-element.model';
import { hasManyMap, hasOneMap } from 'src/app/shared/decorator/adapter/relation-map';
import { adaptableMap } from 'src/app/shared/decorator/adapter/adaptable-map';
import { IBase } from 'src/app/core/models/base.interface';
import { GedConservation, IGedConservation } from './ged-conservation.model';
import { IUser, User } from '../user';


export interface IDossier extends IBase {
  dossier_id: number;
  dossier:IDossier;
  dossiers: IDossier[];
  description: string;
  conservation_id: number;
  conservation: IGedConservation;
  created_at: Date;
  updated_at: Date;
  ged_element: IGedElement;
  is_user: number;
  user: IUser;
  children: {name:string, value: IDossier[]};
  size: number;
  nb_element: number;
  couleur: string;
}

export class Dossier implements IDossier {
    id: number = 0;
    libelle: string = '';
    description = '';
    is_user = 0;
    size = null;
    nb_element: number = 0;

    dossier_id: number = null;

    conservation_id: number = null;
    couleur: string = '#3b5998';


    @adaptableMap('created_at')
    created_at: Date = new Date();

    @adaptableMap('updated_at')
    updated_at: Date = new Date();

    @hasOneMap({field:'ged_conservation_rule', class:GedConservation})
    conservation: IGedConservation = null;

    @hasOneMap({field:'ged_element', class:GedElement})
    ged_element: IGedElement = null;

    @hasOneMap({field: 'inscription', class: User})
    user: IUser = null;

    @hasOneMap({field: 'dossier', class: Dossier})
    dossier: IDossier = null;

    @hasManyMap({field:'dossiers', class: Dossier})
    dossiers: IDossier[] = null;

    get children()
    {
        return {
            'name' : 'dossiers',
            'value': this.dossiers
        };
    }
}
