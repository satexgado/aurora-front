import { CrProvenance, ICrProvenance } from './cr-provenance';
import { hasOneMap } from 'src/app/shared/decorator/adapter/relation-map';
import { IUser, User } from 'src/app/core/models/user';
import { CrCourrier, ICrCourrier } from './cr-courrier';
import { adaptableMap, dateAdaptableMap } from 'src/app/shared/decorator/adapter/adaptable-map';
import { IBase } from 'src/app/core/models/base.interface';
import { CrCoordonnee, ICrCoordonnee } from './cr-coordonnee';

export interface ICrCourrierEntrant extends IBase {
  courrier_id: number;
  courrier: ICrCourrier;
  expediteur_id: number;
  expediteur_type: string;
  responsable_id: number;
  responsable: IUser;
  date_arrive: Date;
  created_at: Date;
  inscription: IUser;
  date_redaction: Date;
  date_limit: Date;
  expediteur_interne: any;
  expediteur_externe: ICrCoordonnee;
  expediteur: any;
  provenance_id: number;
  provenance: ICrProvenance;
}

export class CrCourrierEntrant implements ICrCourrierEntrant {
    id: number = 0;

    get libelle() {
      return  this.courrier? this.courrier.libelle : '';
    }

    expediteur_id:number = 0;
    responsable_id:number = 0;
    courrier_id:number = 0;
    responsable: IUser;
    expediteur_interne: any = null;
    @adaptableMap('provenance')
    provenance_id: number = 0;
    expediteur_type: string = "";

    @dateAdaptableMap('date_arrive')
    date_arrive: Date = new Date();

    @dateAdaptableMap('date_redaction')
    date_redaction: Date = new Date();

    @dateAdaptableMap('date_limit')
    date_limit: Date = new Date();

    @dateAdaptableMap('created_at')
    created_at: Date = new Date();

    @hasOneMap({field:'cr_courrier', class: CrCourrier})
    courrier: ICrCourrier = null;

    @hasOneMap({field:'cr_coordonnee', class: CrCoordonnee})
    expediteur_externe: ICrCoordonnee = null;

    @hasOneMap({field:'cr_provenance', class: CrProvenance})
    provenance: ICrProvenance = null;

    @hasOneMap({field:'inscription', class: User})
    inscription: IUser = null;

    get expediteur() {
      return this.provenance && (!this.provenance.externe)? this.expediteur_interne : this.expediteur_externe;
    }
}
