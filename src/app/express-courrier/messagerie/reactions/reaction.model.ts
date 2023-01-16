import { BaseModel } from 'src/app/shared/models/BaseModel';
import { Structure } from '../../structure/structure/structure.model';
import { User } from '../../users/user.model';

export interface Reaction extends BaseModel {
  reaction: string;
  rebondissement?: number | Reaction | null;
  fichier?: string;
  discussion: number;
  structure: Structure | number;
  inscription?: User;
}
