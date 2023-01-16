import { CacheService } from 'src/app/shared/services';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve} from '@angular/router';
import { Observable } from 'rxjs';
import { MasqueModuleUtilisateurFactory } from '../../../core/services/adm/module-utilisateur-masque';
@Injectable({
   providedIn: 'root'
})
export class MasqueModuleUtilisateurResolver implements Resolve<any[]> {
    constructor(protected cacheService: CacheService) { }
    resolve(): any[] | Observable<any[]> {
      const service2 = this.cacheService.get('allMasqueModuleUtilisateurs',new MasqueModuleUtilisateurFactory().list());
      return service2.pipe(map(data=>data.data))
    }
}
