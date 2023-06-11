import { hasOneMap } from 'src/app/shared/decorator/adapter/relation-map';
import { IUser, User } from './../user';
import { IBase } from 'src/app/core/models/base.interface';
import { adaptableMap } from 'src/app/shared/decorator/adapter/adaptable-map';

export interface IGedPartage extends IBase {
 element_id: number;
 personne_id: number;
 personne: IUser;
 access: 'Lecteur' | 'Collaborateur' | 'Proprietaire';
}

export class GedPartage implements IGedPartage {
    id: number = 0;
    libelle: string = '';
    access: 'Lecteur' | 'Collaborateur' | 'Proprietaire' = 'Lecteur';

    @adaptableMap('personne')
    personne_id = 0;

    @adaptableMap('element')
    element_id = 0;

    @hasOneMap({field: 'personne_inscription', class: User})
    personne: IUser = null

}
