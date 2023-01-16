import { Optional } from '@angular/core';
import { BaseModel } from 'src/app/shared/models/BaseModel';
import { Structure } from '../../structure/structure/structure.model';
import { User } from '../../users/user.model';
import { Reaction } from '../reactions/reaction.model';

export interface Discussion extends BaseModel {
  type: number | TypeDiscussion;
  touched_at: Date;
  correspondance: Correspondance;
  derniere_reaction?: Reaction;
  nombre_reaction_non_lus: number;
}

export const Discussion = {
  getCorrespondant(
    discussion: Discussion,
    intervenant: User | Structure
  ): Correspondant {
    const correspondance = discussion.correspondance!;
    if (User.isUser(intervenant)) {
      if (discussion.type == 1) {
        return intervenant.id == (correspondance?.user1 as User).id
          ? (correspondance?.user2 as User)
          : (correspondance?.user1 as User);
      } else if (discussion.type == 2) {
        return correspondance.structure as Structure;
      }
    } else {
      if (discussion.type == 2) return correspondance.user as User;
    }

    throw new Error('Aucun correspondant trouvé');
  },
};

interface TypeDiscussion extends BaseModel {
  libelle: string;
  description: string;
}

export type Correspondant = User | Structure;

// Correspondance personne
interface CorrespondancePersonne {
  id?: number;
  user1: User | number;
  user2: User | number;
}

// Correspondance personne structure
interface CorrespondancePersonneStructure {
  id?: number;
  user: User | number;
  structure: Structure | number;
}

export interface Correspondance
  extends Partial<CorrespondancePersonne>,
    Partial<CorrespondancePersonneStructure> {
  type: number;
}
