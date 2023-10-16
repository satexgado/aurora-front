import { IBase } from 'src/app/core/models/base.interface';
import { hasOneMap } from 'src/app/shared/decorator/adapter/relation-map';
import { IUser, User } from './../user';


export interface IGedWorkspaceUser extends IBase {
 workspace_id:number;
 personne_id: number;
 personne: IUser;
 groupe_id: number;
}

export class GedWorkspaceUser implements IGedWorkspaceUser {
    id: number = 0;
    libelle: string = '';
    type: 'user' |'coordonnee' = 'user';
    workspace_id: number = null;
    personne_id: number = null;
    groupe_id: number = null;

    @hasOneMap({class: User, field: 'personne_inscription'})
    personne: IUser = null;

}
