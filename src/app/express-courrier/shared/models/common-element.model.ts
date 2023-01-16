import { BaseModel } from '../../../shared/models/BaseModel';

export interface CommonElement extends BaseModel {
  libelle: string;
  description: string;
}
