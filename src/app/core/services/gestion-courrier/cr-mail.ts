import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrMail } from '../../models/gestion-courrier/cr-mail';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class CrMailFactory extends Factory<CrMail> {
  protected readonly endpoint: string = 'courrier/mails';

  constructor() {
    super(CrMail)
  }

  markAsRead(id: number): Observable<any> {
    return this.authAccess
    .get(`${this.url}/${this.endpoint}/markasread/${id}`);
  }
}
