import { IBase } from 'src/app/core/models/base.interface';
import { hasManyMap, hasOneMap } from 'src/app/shared/decorator/adapter/relation-map';

export interface ICrCoordonneeGroupe extends IBase {
  groupe_id: number;
  cr_coordonnees: IBase[];
  nb_coordonnees: number;
  nb_coordonnee_groupes: number;
  groupe: ICrCoordonneeGroupe;
  groupes: ICrCoordonneeGroupe[];
  children: {name:string, value: ICrCoordonneeGroupe[]};
}

export class CrCoordonneeGroupe implements ICrCoordonneeGroupe {
    id: number = 0;
    libelle: string = '';
    groupe_id: number = null;
    cr_coordonnees: IBase[] = null;
    nb_coordonnees: number = 0;
    nb_coordonnee_groupes: number = 0;

    @hasOneMap({field: 'cr_coordonnee_groupe', class: CrCoordonneeGroupe})
    groupe: ICrCoordonneeGroupe = null;

    @hasManyMap({field:'cr_coordonnee_groupes', class: CrCoordonneeGroupe})
    groupes: ICrCoordonneeGroupe[] = null;

    get children()
    {
        return {
            'name' : 'groupes',
            'value': this.groupes
        };
    }

}
