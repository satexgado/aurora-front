import { DomaineFactory } from 'src/app/core/services/domaine';
import { IDomaine } from './../../core/models/domaine';
import { Injectable } from '@angular/core';

import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { CacheService } from '../services';

@Injectable()
export class DomaineExistResolver implements Resolve<Observable<IDomaine[]>> {
  domaine_exist = false;
  constructor(
    protected cacheService: CacheService,
    ) {}

  resolve(route: ActivatedRouteSnapshot) {
    let domaine_name =  route.paramMap.get('slug');
    return this.cacheService.get(
      'allDomaines',
      new DomaineFactory().list().pipe(
        shareReplay(1),
        map(data => data.data)
      ),
    1800000).pipe(
      map( (data) =>   data.filter(domaine => domaine.libelle == domaine_name))
    );
  }
}
