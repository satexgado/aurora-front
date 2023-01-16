import { IBase } from 'src/app/core/models/base.interface';

export interface IMpEtape extends IBase {
  description: string;
}

export class MpEtape implements IMpEtape {
    id: number = 0;
    libelle: string = '';
    description: string = '';
}
