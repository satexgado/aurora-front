import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { ICrCourrierEntrant } from 'src/app/core/models/gestion-courrier/cr-courrier-entrant';
import { ICrCourrierSortant } from 'src/app/core/models/gestion-courrier/cr-courrier-sortant';

@Injectable({
  providedIn: 'root'
})
export class CourrierUiService {

    public courrierEntrantData$ = new BehaviorSubject<ICrCourrierEntrant>(null);

    set courrierEntrantData(courrierEntrantData: ICrCourrierEntrant) {
        this.courrierEntrantData$.next(courrierEntrantData);
    }

    public courrierSortantData$ = new BehaviorSubject<ICrCourrierSortant>(null);

    set courrierSortantData(courrierSortantData: ICrCourrierSortant) {
        this.courrierSortantData$.next(courrierSortantData);
    }

    constructor() { }
}