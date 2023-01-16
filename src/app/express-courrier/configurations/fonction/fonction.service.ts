import { Injectable } from '@angular/core';
import { BaseService } from '../../../shared/services/base.service';
import { Structure } from '../../structure/structure/structure.model';
import { Fonction } from './fonction.model';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FonctionService extends BaseService<Fonction> {
  constructor() {
    super('fonctions');
  }

  getByStructure(structure: Structure) {
    return this.factory
      .get(`structures/${structure.id}/${this.endPoint}`)
      .pipe(tap(this.listResponseHandler()));
  }
}
