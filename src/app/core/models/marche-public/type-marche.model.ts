import { IBase } from 'src/app/core/models/base.interface';

export interface IMpMarcheType extends IBase {
  cant_delete: number;
}

export class MpMarcheType implements IMpMarcheType {
    id: number = 0;
    libelle: string = '';
    cant_delete: number = 0;
}
