import { IBase } from 'src/app/core/models/base.interface';

export interface IMpProcedureTypeEtape extends IBase {
  description: string;
  position: number;
  type_procedure_id: number;
}

export class MpProcedureTypeEtape implements IMpProcedureTypeEtape {
    id: number = 0;
    libelle: string = '';
    description: string = '';
    position: number = 0;
    type_procedure_id: number = 0;
}
