import { IBase } from 'src/app/core/models/base.interface';
import { CrCoordonnee, ICrCoordonnee } from '../gestion-courrier/cr-coordonnee';
import { hasOneMap } from 'src/app/shared/decorator/adapter/relation-map';


export interface IGedWorkspaceCoordonnee extends IBase {
 workspace_id:number;
 coordonnee_id: number;
 coordonnee: ICrCoordonnee;
 groupe_id: number;
}

export class GedWorkspaceCoordonnee implements IGedWorkspaceCoordonnee {
    id: number = 0;
    libelle: string = '';
    workspace_id: number = null;
    coordonnee_id: number = null;
    groupe_id: number = null;

    @hasOneMap({class: CrCoordonnee, field: 'cr_coordonnee'})
    coordonnee: ICrCoordonnee = null;

}
