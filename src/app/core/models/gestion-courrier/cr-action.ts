import { IBase } from 'src/app/core/models/base.interface';

export  enum CrActionEnum {
  affectation = 'affectation',
  depot = 'depot',
  traitement = 'traitement',
  validation = 'validation',
  a_effectuer = 'a_effectuer',
}

export interface ICrAction extends IBase {
  masque: CrActionEnum;
}

export class CrAction implements ICrAction {
    id: number = 0;
    libelle: string = '';
    masque:CrActionEnum = CrActionEnum.affectation;
}
