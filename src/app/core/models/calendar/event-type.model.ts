import { IBase } from 'src/app/core/models/base.interface';
import { adaptableMap} from 'src/app/shared/decorator/adapter/adaptable-map';


export interface ICalendrierEventType extends IBase {
    couleur: string;
}

export class CalendrierEventType implements ICalendrierEventType {
    @adaptableMap('id_type_calendrier')
    id: number = 0;

    @adaptableMap('libelle_type')
    libelle: string = '';

    couleur = '';

}
