import { hasOneMap } from 'src/app/shared/decorator/adapter/relation-map';
import { CrCourrier, ICrCourrier } from './cr-courrier';
import { IBase } from 'src/app/core/models/base.interface';

export interface ICrCourrierInterne extends IBase {
  courrier_id: number;
  courrier: ICrCourrier;
}

export class CrCourrierInterne implements ICrCourrierInterne {
    id: number = 0;

    get libelle() {
      return  this.courrier? this.courrier.libelle : '';
    }

    courrier_id:number = 0;

    @hasOneMap({field:'cr_courrier', class: CrCourrier})
    courrier: ICrCourrier = null;

}
