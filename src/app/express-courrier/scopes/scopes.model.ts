import { BaseModel } from '../../shared/models/BaseModel';

export interface Scope extends BaseModel {
  libelle: string;
  description?: string;
  ensemble: string;
}
