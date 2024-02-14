import { IBase } from 'src/app/core/models/base.interface';
import { adaptableMap} from 'src/app/shared/decorator/adapter/adaptable-map';


export interface ICalendrierEventGroup extends IBase {
}

export class CalendrierEventGroup implements ICalendrierEventGroup {
    @adaptableMap('id_type_calendrier')
    id: number = 0;

    libelle: string = '';
}
