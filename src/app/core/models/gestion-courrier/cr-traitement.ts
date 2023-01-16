import { dateAdaptableMap } from 'src/app/shared/decorator/adapter/adaptable-map';
import { IBase } from 'src/app/core/models/base.interface';

export interface ICrTraitement extends IBase {
  action: string;
  courrier_id: number;
  commentaire: string;
}

export class CrTraitement implements ICrTraitement {
    id: number = 0;
    libelle: string = '';
    courrier_id: number = 0;
    commentaire: string = '';
    action: string = '';
}
