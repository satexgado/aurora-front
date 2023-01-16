import { Injectable } from '@angular/core';
import { BaseService } from '../../../shared/services/base.service';
import { Structure } from '../../structure/structure/structure.model';
import { Poste } from './poste.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PosteService extends BaseService<Poste> {
  constructor() {
    super('postes');
  }

  getByStructure(structure: Structure) {
    return this.factory
      .get(`structures/${structure.id}/${this.endPoint}`)
      .pipe(tap(this.listResponseHandler()));
  }
}
