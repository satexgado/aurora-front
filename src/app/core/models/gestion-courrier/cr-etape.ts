import { hasOneMap } from 'src/app/shared/decorator/adapter/relation-map';
import { IUser, User } from 'src/app/core/models/user';
import { CrStatut, ICrStatut } from 'src/app/core/models/gestion-courrier/cr-statut';
import { CrType, ICrType } from 'src/app/core/models/gestion-courrier/cr-type';
import { IBase } from 'src/app/core/models/base.interface';

export interface ICrEtape extends IBase {
  description: string;
  etape: number;
  type_id: number;
  responsable_id: number;
  responsable: IUser;
  structure_id: number;
  structure: any;
  duree: number;
}

export class CrEtape implements ICrEtape {
    id: number = 0;
    libelle: string = '';
    description = '';
    etape: number = 0;
    type_id: number = 0;
    structure_id: number = 0;
    responsable_id: number = 0;
    duree: number = 1;
    structure: any = null;

    @hasOneMap({field:'responsable', class: User})
    responsable: IUser = null;
}
