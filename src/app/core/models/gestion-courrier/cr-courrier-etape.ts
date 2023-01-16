import { IBase } from 'src/app/core/models/base.interface';
import { hasOneMap } from 'src/app/shared/decorator/adapter/relation-map';
import { IUser, User } from '../user';

export interface ICrCourrierEtape extends IBase {
  description: string;
  duree: number;
  responsable_id: number;
  responsable: IUser;
  structure_id: number;
  courrier_id: number;
  structure: any;
  statut_color: string;
  statut_icon: string;
  statut: string;
  commentaire: string;
}

export class CrCourrierEtape implements ICrCourrierEtape {
    id: number = 0;
    libelle: string = '';
    description: string = '';
    duree: number = 1;
    responsable_id: number = null;
    structure_id: number = null;
    courrier_id: number = null;
    structure: any = null;
    statut: string = 'En attente';
    commentaire: string = '';

    get statut_color() {
      switch(this.statut) {
        case 'En attente': return 'text-info';
        case 'Validé': return 'text-success';
        default: return 'text-danger';
      }
    }

    get statut_icon() {
      switch(this.statut) {
        case 'En attente': return 'fal fa-exclamation-circle';
        case 'Validé': return 'fal fa-check-circle';
        default: return 'fal fa-ban';
      }
    }

    @hasOneMap({field:'responsable', class: User})
    responsable: IUser = null;
}
