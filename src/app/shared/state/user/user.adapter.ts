import { Adapter } from "../adapter";
import { User } from "./user.resource";

export class UserAdapter implements Adapter {

    key = {
        id: 'id_inscription',
        date_naissance: 'date_naissance',
        sexe: 'sexe' ,
        email: 'email',
        nom: 'nom',
        prenom: 'prenom',
        slug: 'slug',
        avatar: 'avatar',
        idcam: 'idcam'
    };

    fromJson(json: any): User {
      const user = new User();
      let key = this.key;

      Object.keys(key).forEach(function (item) {

          user[item] = json[key[item]]
      });

      if(user.date_naissance)
      {
        user.date_naissance = new Date(user.date_naissance);
      }

      return user;
    }

    toJson(user: User): any {
      let result: {} = {};
      let key = this.key;
      Object.keys(user).forEach(function (item) {
        if(!(item === 'pays'))
        {
            result[key[item]] = user[item]
        }
      });
      if(result[key['date_naissance']])
      {
        let date = result[key['date_naissance']] as Date;
        result[key['date_naissance']] = date.toISOString().slice(0, 19).replace('T', ' ');
      }
      return result;
    }

}
