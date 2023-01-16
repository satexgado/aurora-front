import { ScopesService } from './../scopes/scopes.service';
import { Injectable } from '@angular/core';
import { BaseDependancies } from '../../shared/base-component/base-dependancies';

@Injectable({
  providedIn: 'root',
})
export class RolesDependancies extends BaseDependancies {
  data: { scopes: any } = {
    scopes: [],
  };

  loading = {
    scopes: false,
  };

  constructor(public scopeService: ScopesService) {
    super();
  }

  getScopes(callback?: Function): void {
    if (!this.data.scopes.length) {
      this.loading.scopes = true;
      this.scopeService.get({ emitData: false }).subscribe((scopes) => {
        this.data.scopes = scopes.filter((scope) => scope.libelle != 'ADMIN');
        this.loading.scopes = false;
        if (callback) callback();
      });
    } else {
      if (callback) callback();
    }
  }
}
