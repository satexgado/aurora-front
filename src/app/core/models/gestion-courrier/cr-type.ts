import { CrEtape, ICrEtape } from './cr-etape';
import { IBase } from 'src/app/core/models/base.interface';
import { hasManyMap } from 'src/app/shared/decorator/adapter/relation-map';

export interface ICrType extends IBase {
  description: string;
  etapes: ICrEtape[];
}

export class CrType implements ICrType {
    id: number = 0;
    libelle: string = '';
    description: string = '';

    @hasManyMap({field: 'cr_etapes', class: CrEtape})
    etapes: ICrEtape[] = null;

    get children()
    {
        return {
            'name' : 'etapes',
            'value': this.etapes
        };
    }
}
