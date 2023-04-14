import { hasManyMap, hasOneMap } from 'src/app/shared/decorator/adapter/relation-map';
import { IUser, User } from 'src/app/core/models/user';
import { IBase } from 'src/app/core/models/base.interface';
import { CrCourrier, ICrCourrier } from './cr-courrier';
import { dateAdaptableMap } from 'src/app/shared/decorator/adapter/adaptable-map';

export interface ICrTache extends IBase {
  description: string;
  inscription: IUser;
  responsables: IUser[];
  date_limit: Date;
  archived_at: Date | '';
  courrier_id: number;
  inscription_id: number;
  courriers: ICrCourrier[];
  structures: any[];
  statut_color: string;
  statut_bgcolor: string;
  statut_icon: string;
  statut: string;
  affectations: any[];
  comments_count: number;
}

export enum  CrTacheStatut {
  traitement = 'Traitement',
  attente = 'En attente',
  valide = 'Valide',
  nonvalide = 'Non valide'
}
export class CrTache implements ICrTache {
    id: number = 0;
    libelle: string = '';
    description = '';
    courrier_id: number = null;
    inscription_id: number = 0;
    structures: any[] = null;
    statut: string = 'En attente';
    comments_count = 0;

    get statut_color() {
      switch(this.statut) {
        case CrTacheStatut.traitement : return 'text-warning';
        case CrTacheStatut.attente: return 'text-info';
        case CrTacheStatut.valide: return 'text-success';
        default: return 'text-danger';
      }
    }

    get statut_bgcolor() {
      switch(this.statut) {
        case CrTacheStatut.traitement : return 'bg-warning';
        case CrTacheStatut.attente: return 'bg-info';
        case CrTacheStatut.valide: return 'bg-success';
        default: return 'bg-danger';
      }
    }

    get statut_icon() {
      switch(this.statut) {
        case CrTacheStatut.attente: return 'fal fa-exclamation-circle';
        case CrTacheStatut.traitement: return 'fal fa-typewriter';
        case CrTacheStatut.valide: return 'fal fa-check-circle';
        default: return 'fal fa-ban';
      }
    }

    @dateAdaptableMap('date_limit')
    date_limit: Date = new Date();

    @dateAdaptableMap('archived_at')
    archived_at: Date | '' = null;

    @hasManyMap({field:'responsables', class: User})
    responsables: IUser[] = null;

    @hasOneMap({field:'inscription', class: User})
    inscription: IUser = null;

    @hasManyMap({field:'courrier', class: CrCourrier})
    courriers: ICrCourrier[] = null;

    get affectations() {
      return [...this.responsables, ...this.structures];
    }
}
