import { CrEtape, ICrEtape } from './cr-etape';
import { IBase } from 'src/app/core/models/base.interface';
import { hasManyMap } from 'src/app/shared/decorator/adapter/relation-map';
import { CrTache, ICrTache } from './cr-tache';

export interface ICrTacheList extends IBase {
    taches:ICrTache[];
}

export class CrTacheList implements ICrTacheList {
    id: number = 0;
    libelle: string = '';

    @hasManyMap({field: 'cr_taches', class: CrTache})
    taches: ICrTache[] = null;
}
