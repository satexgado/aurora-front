import { Fonction } from "src/app/express-courrier/configurations/fonction/fonction.model";
import { Poste } from "src/app/express-courrier/configurations/poste/poste.model";
import { Role } from "src/app/express-courrier/roles/roles.model";
import { Structure } from "src/app/express-courrier/structure/structure/structure.model";
import { User } from "src/app/express-courrier/users/user.model";
import { BaseModel } from "src/app/shared/models/BaseModel";

export interface Employe extends BaseModel {
  poste?: Poste;
  fonction?: Fonction;
  structure?: Structure;
  role: Role;
  user: User;
}
