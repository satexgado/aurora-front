import { IBase } from 'src/app/core/models/base.interface';
import { hasManyMap } from 'src/app/shared/decorator/adapter/relation-map';
import { IUser, User } from '../user';

export interface ICrServiceDefault extends IBase {

  structure_id: number;
  structure: any;
  users: IUser[];

}

export class CrServiceDefault implements ICrServiceDefault {

    id: number = 0;

    get libelle() {
      return this.structure ? this.structure.libelle : '';
    }

    structure_id: number = 0;
    structure:any = null;

    @hasManyMap({field: 'personnes', class: User})
    users: IUser[]=null;

}
