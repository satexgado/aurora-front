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
    tache_linkeds: any;
    statut_color: string;
    statut_bgcolor: string;
    statut_icon: string;
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
    tache_linkeds: any = null;

    @adaptableMap('photo')
    avatar:string = "";

    @dateAdaptableMap('last_activity_at')
    last_activity_at: Date = null;

    get online_statut() {
        if((!this.last_activity_at) ||  moment(new Date()).diff(moment(this.last_activity_at), 'minute') > 10) return 'offline';
        return moment(new Date()).diff(moment(this.last_activity_at), 'minute') > 1 ? 'away' : 'online';
    }

    get statut_color() {
        switch(this.online_statut) {
          case 'away' : return 'text-warning';
          case 'offline': return 'text-danger';
          case 'online': return 'text-success';
          default: return 'text-info';
        }
      }
  
      get statut_bgcolor() {
        switch(this.online_statut) {
          case 'away' : return 'bg-warning';
          case 'offline': return 'bg-danger';
          case 'online': return 'bg-success';
          default: return 'bg-info';
        }
      }
  
      get statut_icon() {
        switch(this.online_statut) {
          case 'offline': return 'fal fa-exclamation-circle';
          case 'away': return 'fal fa-ban';
          case 'online': return 'fal fa-check-circle';
          default: return 'fal fa-typewriter';
        }
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
