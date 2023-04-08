import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StructureUiService {


    public structure$ = new BehaviorSubject<any>(null);

    set structure(structure: any) {
        this.structure$.next(structure);
    }

    constructor() { }
}