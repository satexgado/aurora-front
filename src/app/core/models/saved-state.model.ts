import { IBase } from './base.interface';
import { cloneable, decycle, retrocycle, shouldDisableSubmit } from 'src/app/shared/helperfonction';

export interface ISavedState extends IBase {
    module: string ;
    state: string ;
    libelle: string;
}

export class SavedState implements ISavedState {
    id: number = 0;
    libelle: string = '';
    module: string  = '';
    state: string  = '';

    get retroState() {
        return this.state ? retrocycle(JSON.parse(this.state)) : null;
    }
}
