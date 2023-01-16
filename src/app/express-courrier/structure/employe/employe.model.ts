import { Structure } from './../structure/structure.model';
import { Role } from './../../roles/roles.model';
import { User } from '../../users/user.model';
import { BaseModel } from '../../../shared/models/BaseModel';
import { Poste } from '../../configurations/poste/poste.model';
import { Fonction } from '../../configurations/fonction/fonction.model';

export interface Employe extends BaseModel {
  poste?: Poste;
  fonction?: Fonction;
  structure?: Structure;
  role: Role;
  user: User;
}
