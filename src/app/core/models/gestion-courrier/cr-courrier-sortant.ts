import { hasManyMap, hasOneMap } from 'src/app/shared/decorator/adapter/relation-map';
import { CrCourrier, ICrCourrier } from './cr-courrier';
import { dateAdaptableMap } from 'src/app/shared/decorator/adapter/adaptable-map';
import { IBase } from 'src/app/core/models/base.interface';
import { CrCourrierEntrant, ICrCourrierEntrant } from './cr-courrier-entrant';
import { CrDestinataire, ICrDestinataire } from './cr-destinataire';

export interface ICrCourrierSortant extends IBase {
  courrier_id: number;
  courrier: ICrCourrier;
  courrier_entrant_id: number;
  courrier_entrant: ICrCourrierEntrant;
  date_envoie: Date;
  action_depot: string;
  destinataires: ICrDestinataire[];
  ampiliations: ICrDestinataire[];
  date_redaction: Date;
  date_limit: Date;
  created_at: Date;
}

export class CrCourrierSortant implements ICrCourrierSortant {

    id: number = 0;

    get libelle() {
      return  this.courrier? this.courrier.libelle : '';
    }

    action_depot: string = '';
    courrier_entrant_id:number = null;
    courrier_id:number = 0;

    @dateAdaptableMap('date_redaction')
    date_redaction: Date = new Date();

    @dateAdaptableMap('date_envoie')
    date_envoie: Date = new Date();

    @dateAdaptableMap('date_limit')
    date_limit: Date = new Date();

    @hasOneMap({field:'cr_courrier', class: CrCourrier})
    courrier: ICrCourrier = null;

    @hasOneMap({field:'cr_courrier_entrant', class: CrCourrierEntrant})
    courrier_entrant: ICrCourrierEntrant = null;

    @hasManyMap({field:'cr_destinataires', class: CrDestinataire})
    destinataires: ICrDestinataire[] = null;

    @hasManyMap({field:'cr_ampiliations', class: CrDestinataire})
    ampiliations: ICrDestinataire[] = null;

    @dateAdaptableMap('created_at')
    created_at: Date = new Date();

}
