import { hasOneMap } from 'src/app/shared/decorator/adapter/relation-map';
import { IUser, User } from 'src/app/core/models/user';
import { IBase } from 'src/app/core/models/base.interface';
import { adaptableMap, dateAdaptableMap } from 'src/app/shared/decorator/adapter/adaptable-map';

export interface ICrDossier extends IBase {
  objet: string;
  structure_id: number;
  responsable_id: number;
  date_cloture: Date;
  date_creation: Date;

  structure: any;
  responsable: IUser;

  courrier_entrants: any;
  courrier_sortants: any;
}

export class CrDossier implements ICrDossier {
    id: number = 0;
    libelle: string = '';
    objet = '';
    structure_id: number = 0;
    responsable_id: number = 0;
    inscription_id: number = 0;
    structure: any = null;

    @adaptableMap('cr_courrier_entrants')
    courrier_entrants: any = null;

    @adaptableMap('cr_courrier_sortants')
    courrier_sortants: any = null;

    @dateAdaptableMap('date_execution')
    date_cloture: Date = new Date();

    @dateAdaptableMap('created_at')
    date_creation: Date = new Date();

    @hasOneMap({field: 'responsable_inscription', class: User})
    responsable: IUser = null;

    get courriers() {
      return [...this.courrier_entrants, ...this.courrier_sortants];
    }

}
