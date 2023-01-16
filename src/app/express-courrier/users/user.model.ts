import { BaseModel } from '../../shared/models/BaseModel';
import { AffectationStructure } from './../structure/structure/affectation_structure/affectation_structure.model';

export interface User extends BaseModel {
  prenom: string;
  nom: string;
  date_naissance?: Date;
  lieu_naissance?: string;
  identifiant?: string;
  telephone?: string;
  photo?: string;
  sexe?: string;
  inscription?: number | User;
  email?: string;
  email_verified_at?: Date;
  password?: string;
  nom_complet?: string;
  affectation_structure?: AffectationStructure;

  isUser(): this is User;
}

export const User = {
  isUser(element?: unknown): boolean {
    if (!element) return null;
    return (element as User).prenom != null;
  },
};
