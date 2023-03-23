import { hasOneMap } from 'src/app/shared/decorator/adapter/relation-map';
import { IUser, User } from 'src/app/core/models/user';
import { dateAdaptableMap } from 'src/app/shared/decorator/adapter/adaptable-map';
import { IBase } from 'src/app/core/models/base.interface';
import { CrCourrier, ICrCourrier } from './cr-courrier';

export interface ICrReaffectation extends IBase {
  courrier_id: number;
  courrier: ICrCourrier;
  structure: IBase;
  structure_id: number;
  suivi_par: number;
  suivi_par_user: IUser;
  created_at: Date;
  affecter_par: IUser;
  inscription: any;
  confirmation: number;
  annulation: number;
  is_user: number;
  link: string;
}

export class CrReaffectation implements ICrReaffectation {
    id: number = 0;
    libelle: string = '';
    link: string = '';
    courrier_id: number = 0;
    structure_id: number = 0;
    suivi_par: number = 0;
    confirmation: number = 0;
    annulation: number = 0;
    inscription: any = null;
    is_user = 0;

    @dateAdaptableMap('created_at')
    created_at: Date = new Date();

    @hasOneMap({field:'cr_courrier', class: CrCourrier})
    courrier: ICrCourrier = null;

    structure: IBase = null;

    @hasOneMap({field:'suivi_par_inscription', class: User})
    suivi_par_user: IUser = null;

    @hasOneMap({field:'inscription', class: User})
    affecter_par: IUser = null;
}
