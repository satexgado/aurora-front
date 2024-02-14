import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { ICrCoordonnee } from 'src/app/core/models/gestion-courrier/cr-coordonnee';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceUiService {

    public coordonneeData$ = new BehaviorSubject<ICrCoordonnee>(null);

    set coordonneeData(coordonneeData: ICrCoordonnee) {
        this.coordonneeData$.next(coordonneeData);
    }

    constructor() { }
}