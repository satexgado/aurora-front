import { Resource } from '../resource';

export class User extends Resource {
    date_naissance: Date;
    sexe: 'homme'| 'femme'| 'h'| 'f' ;
    email: string;
    nom: string;
    prenom: string;
    slug: string;
    avatar: string;
    identifiant: string;
    idcam: string;

    // get libelle()
    // {
    //     return `${this.prenom} ${this.nom}`;
    // }

    get nom_complet()
    {
        return `${this.prenom} ${this.nom}`;
    }
}
