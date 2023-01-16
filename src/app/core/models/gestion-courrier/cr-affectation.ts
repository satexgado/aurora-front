import { hasOneMap } from 'src/app/shared/decorator/adapter/relation-map';
import { adaptableMap } from 'src/app/shared/decorator/adapter/adaptable-map';
import { IBase } from '../base.interface';
import { IUser, User } from './../user';
import { CrCourrier, ICrCourrier } from './cr-courrier'

export interface ICrAffectation extends IBase {
  courrier_id: number;
  courrier: ICrCourrier;
  objet: any;
  objet_objet: string;
  objet_id: number;
  suggestion_reponse: string;
  recommandation: string;
  inscription: IUser;
}

export class CrAffectation implements ICrAffectation {
    id: number = 0;
    libelle: string = '';

    @adaptableMap('courrier')
    courrier_id: number;

    @hasOneMap({field:'cr_courrier' , class:CrCourrier})
    courrier: ICrCourrier;

    objet: any;
    objet_objet: string;
    objet_id: number;
    suggestion_reponse: string;
    recommandation: string;

    @hasOneMap({field:'inscription' , class:User})
    inscription: IUser;
}
