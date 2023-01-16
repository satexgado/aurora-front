import { IBase } from 'src/app/core/models/base.interface';


export interface IFichierType extends IBase {
  icon: string;
  extension: string;
}

export class FichierType implements IFichierType {
    id: number = 0;
    libelle: string = '';
    icon = '';
    extension: string = '';
}
