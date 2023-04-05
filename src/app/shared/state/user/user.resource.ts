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
    lieu_naissance: string;
    telephone: string;
    affectation_structures: any;
    tache_linkeds: any;
    online_statut: 'online'| 'offline'| 'away';
    last_activity_at: Date;
    statut_color: string;
    statut_bgcolor: string;
    statut_icon: string;
    // get libelle()
    // {
    //     return `${this.prenom} ${this.nom}`;
    // }

    get nom_complet()
    {
        return `${this.prenom} ${this.nom}`;
    }
}
