import { adaptableMap, dateAdaptableMap } from 'src/app/shared/decorator/adapter/adaptable-map';
import { IBase } from './base.interface';

export interface IUser extends IBase {
    date_naissance: Date;
    sexe: 'homme'| 'femme'| 'h'| 'f' ;
    email: string;
    nom: string;
    prenom: string;
    slug: string;
    avatar: string;
    identifiant: string;
    idcam: string;
    readonly nom_complet: string;
}

export class User implements IUser {
    id: number = 0;

    @dateAdaptableMap('date_naissance')
    date_naissance: Date = new Date;

    @adaptableMap('sexe')
    sexe: 'homme'| 'femme'| 'h'| 'f' = 'homme';

    email: string = '';
    nom: string  = '';
    prenom: string  = '';
    slug: string  = '';
    identifiant: string  = '';
    idcam: string  = '';
    @adaptableMap('photo')
    avatar:string = "";

    get libelle()
    {
        return `${this.prenom} ${this.nom}`;
    }

    get nom_complet()
    {
        return `${this.prenom} ${this.nom}`;
    }
}
