import { IBase } from 'src/app/core/models/base.interface';

export interface ICrStructureCopie extends IBase {
  courrier_id: number;
  structure_id: number;
  info: number;
  traitement: number;
}

export class CrStructureCopie implements ICrStructureCopie {
    id: number = 0;
    libelle: string = '';
    courrier_id: number = 0;
    structure_id: number = 0;
    info: number = 0;
    traitement: number = 0;
}
