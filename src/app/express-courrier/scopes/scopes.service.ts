import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';

@Injectable({
  providedIn: 'root',
})
export class ScopesService extends BaseService {
  constructor() {
    super('scopes');
  }
}
