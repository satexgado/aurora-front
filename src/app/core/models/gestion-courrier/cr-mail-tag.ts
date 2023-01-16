import { IBase } from 'src/app/core/models/base.interface';

export interface ICrMailTag extends IBase {
}

export class CrMailTag implements ICrMailTag {
    id: number = 0;
    libelle: string = '';
}
