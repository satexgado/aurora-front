import { IBase } from 'src/app/core/models/base.interface';
import { hasManyMap } from 'src/app/shared/decorator/adapter/relation-map';

export interface ICrDomaine extends IBase {
  description: string;
  priorite: number;
}

export class CrDomaine implements ICrDomaine {
    id: number = 0;
    libelle: string = '';
    description: string = '';
    priorite: number = 1;
}
