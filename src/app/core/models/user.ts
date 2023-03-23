import { adaptableMap, dateAdaptableMap } from 'src/app/shared/decorator/adapter/adaptable-map';
import { IBase } from './base.interface';
import * as moment from 'moment';

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
    lieu_naissance: string;
    telephone: string;
    affectation_structures: any;
    readonly nom_complet: string;
    online_statut: 'online'| 'offline'| 'away';
    last_activity_at: Date;
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
    lieu_naissance: string = '';
    telephone: string = '';
    affectation_structures: any = null;

    @adaptableMap('photo')
    avatar:string = "";

    @dateAdaptableMap('last_activity_at')
    last_activity_at: Date = null;

    get online_statut() {
        if(!this.last_activity_at) return 'offline';
        console.log(moment(new Date()).diff(moment(this.last_activity_at), 'minute'));
        return moment(new Date()).diff(moment(this.last_activity_at), 'minute') > 3 ? 'away' : 'online';
    }

    get libelle()
    {
        return `${this.prenom} ${this.nom}`;
    }

    get nom_complet()
    {
        return `${this.prenom} ${this.nom}`;
    }
}
