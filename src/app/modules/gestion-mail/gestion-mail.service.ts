import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { ICrMail } from 'src/app/core/models/gestion-courrier/cr-mail';

@Injectable({
  providedIn: 'root'
})
export class GestionMailService {

  public newMail$ = new Subject<true>();
  public transfertMail$ = new Subject<ICrMail>();
  public respondMail$ = new Subject<ICrMail>();
  public respondToAllMail$ = new Subject<ICrMail>();

  public onEmailCreated$  = new Subject<ICrMail>();

  constructor() { }
}
