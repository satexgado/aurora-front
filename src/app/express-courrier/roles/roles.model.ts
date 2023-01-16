import { BaseModel } from '../../shared/models/BaseModel';
import { Authorisation } from './autorisations/authorisations.model';
import { Structure } from './../structure/structure/structure.model';
import { User } from './../../shared/state/user/user.resource';

export interface Role extends BaseModel {
  libelle: string;
  description?: string;
  structure: number | Structure;
  nombre_utilisateurs?: number;
  users?: User[];
  authorisations?: Authorisation[];
}
