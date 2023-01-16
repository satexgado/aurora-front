import { BaseModel } from '../../../shared/models/BaseModel';
import { Role } from './../roles.model';
import { Scope } from './../../scopes/scopes.model';

export interface Authorisation extends BaseModel {
  role: number | Role;
  scope?: number | Scope;
  scope_name: string;
  authorisation: string;
}
