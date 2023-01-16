import { BaseModel } from '../../../../shared/models/BaseModel';
import { Fonction } from '../../../configurations/fonction/fonction.model';
import { Poste } from '../../../configurations/poste/poste.model';
import { User } from '../../../users/user.model';

import { Structure } from './../structure.model';

export interface AffectationStructure extends BaseModel {
  user: User | number;
  poste: Poste | number;
  fonction: Fonction | number;
  structure: Structure | number;
}
