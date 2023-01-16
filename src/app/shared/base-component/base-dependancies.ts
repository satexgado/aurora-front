import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseDependancies {
  abstract data: { [k: string]: any[] };
  abstract loading: { [k: string]: boolean };
}
