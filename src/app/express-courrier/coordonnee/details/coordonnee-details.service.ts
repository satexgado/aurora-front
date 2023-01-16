import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ICrCourrierEntrant } from 'src/app/core/models/gestion-courrier/cr-courrier-entrant';
import { ICrCourrierSortant } from 'src/app/core/models/gestion-courrier/cr-courrier-sortant';
import { IMpMarche } from 'src/app/core/models/marche-public/marche.model';


@Injectable({
  providedIn: 'root'
})
export class CoordonneeDetailsService {

    public courrierEntrantData$ = new BehaviorSubject<ICrCourrierEntrant>(null);

    set courrierEntrantData(courrierEntrantData: ICrCourrierEntrant) {
        this.courrierEntrantData$.next(courrierEntrantData);
    }

    public courrierSortantData$ = new BehaviorSubject<ICrCourrierSortant>(null);

    set courrierSortantData(courrierSortantData: ICrCourrierSortant) {
        this.courrierSortantData$.next(courrierSortantData);
    }

    public marchePublicData$ = new BehaviorSubject<IMpMarche>(null);

    set marchePublicData(marchePublicData: IMpMarche) {
        this.marchePublicData$.next(marchePublicData);
    }

  constructor() { }
}