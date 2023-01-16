import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { ICrMail } from 'src/app/core/models/gestion-courrier/cr-mail';

@Injectable({
  providedIn: 'root'
})
export class MailInterneService {

    public mailData$ = new BehaviorSubject<ICrMail>(null);

    set mailData(mailData: ICrMail) {
        this.mailData$.next(mailData);
    }

  constructor() { }
}