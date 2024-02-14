// import { SessionMatiere } from 'src/app/core/models/session-matiere.model';
// import { ISessionMatiere } from './../session-matiere.model';
// import { EvaluationType, IEvaluationType } from './../evaluation-type.model';
// import { Niveau } from './../enseignement/niveau';
// import { INiveau } from 'src/app/core/models/enseignement/niveau';
import { User, IUser } from './../user';
import { hasOneMap, hasManyMap } from 'src/app/shared/decorator/adapter/relation-map';
import { ICalendrierEventType, CalendrierEventType } from './event-type.model';
import { adaptableMap, dateAdaptableMap } from 'src/app/shared/decorator/adapter/adaptable-map';
import { IBase } from '../base.interface';
// import { IMatiere, Matiere } from '../matiere';
import RRule from 'rrule';
import * as moment from 'moment';
// import { IPersonnel, Personnel } from '../rh/personnel.model';

export enum EventTypeEnum {
  cours= 3,
  evaluation = 4,
  inscription = 5
}
export interface ICalendrierEvent extends IBase {
    affectable: any;
    affectable_id: number;
    affectable_type: string;
    type: ICalendrierEventType;
    type_id: number;
    // matieres: IMatiere[];
    // niveau: INiveau;
    rrule: string;
    duration: string;
    date_debut: Date;
    date_fin: Date;
    allDay: number | boolean;
    description;
    participants: IUser[];
    // personnels: IPersonnel[];
    formated_date_debut: String | null;
    formated_date_fin: String | null;
    // evaluation_type: IEvaluationType;
    // session_matiere: ISessionMatiere;
}

export class CalendrierEvent implements ICalendrierEvent {
  @adaptableMap('id_calendrier')
    id: number = 0;
    affectable = null;
    libelle = '';
    description = '';
    rrule = null;
    duration = null;

    @dateAdaptableMap('date_debut')
    date_debut: Date = null;

    @dateAdaptableMap('date_fin')
    date_fin: Date = null;

    affectable_type = null;
    affectable_id = null;

    @adaptableMap('type')
    type_id = null;

    @adaptableMap('all_day')
    allDay: number | boolean = 0;

    @hasOneMap({field:'cal_type_calendrier', class: CalendrierEventType})
    type: ICalendrierEventType  = null;

    // @hasOneMap({field:'visi_type_evaluation', class: EvaluationType})
    // evaluation_type: IEvaluationType = null;

    // @hasOneMap({field:'visi_session_matiere', class: SessionMatiere})
    // session_matiere: ISessionMatiere = null;

    // @hasManyMap({field:'visi_matieres', class: Matiere})
    // matieres: IMatiere[]  = null;

    // @hasOneMap({field:'visi_niveau', class: Niveau})
    // niveau: INiveau  = null;

    @hasManyMap({field:'participants', class: User})
    participants: IUser[]  = null;

    // @hasManyMap({field:'personnels', class: Personnel})
    // personnels: IPersonnel[]  = null;

    get formated_date_debut() {
      moment.locale('fr');
      if(this.date_debut) {
        return moment(this.date_debut)
        .format("dddd Do MMMM  YYYY");
      }
      if(this.rrule) {
        const rule = RRule.fromString(this.rrule);
        return moment(rule.all().shift())
        .format("dddd Do MMMM  YYYY");
      }
      return null;
    }

    get formated_date_fin() {
    moment.locale('fr');

      if(this.date_fin) {
        return moment(this.date_fin)
        .format("dddd Do MMMM  YYYY");
      }
      if(this.rrule) {
        const rule = RRule.fromString(this.rrule);
        return  moment(rule.all().pop())
        .format("dddd Do MMMM  YYYY");
      }
      return null;
    }
}
