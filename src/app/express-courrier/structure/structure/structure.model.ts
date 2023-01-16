import { BaseModel } from './../../../shared/models/BaseModel';
export interface Structure extends BaseModel {
  libelle: string;
  description: string;
  cigle: string;
  image: string;
  type: { id: number; libelle: string } | number;
  parent: number | Structure;
  sous_structures?: Structure[];
  has_sous_structure?: boolean;

  isStructure(): this is Structure;
}

export const Structure = {
  isStructure(element: unknown): boolean {
    return (element as Structure).libelle != null;
  },
};
