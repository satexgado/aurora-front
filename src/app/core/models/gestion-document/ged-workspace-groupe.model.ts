import { IBase } from 'src/app/core/models/base.interface';
import { environment } from 'src/environments/environment';

export interface IGedWorkspaceGroupe extends IBase {
 type: 'user' |'coordonnee';
 workspace_id:number;
}

export class GedWorkspaceGroupe implements IGedWorkspaceGroupe {
    id: number = 0;
    libelle: string = '';
    type: 'user' |'coordonnee' = 'user';
    workspace_id: number = 0;
}
