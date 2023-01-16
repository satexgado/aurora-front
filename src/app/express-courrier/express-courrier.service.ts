import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class ExpressCourrierService {


  link: {libelle: string, icon: string, url: string}[] = [
    {
      libelle: 'Courrier',
      icon: 'fal fa-mail-bulk',
      url: './courrier/entrant'
    },
    {
      libelle: 'Documents',
      icon: 'fal fa-file-alt',
      url: './document'
    },
    {
      libelle: 'Marche Public',
      icon: 'fal fa-balance-scale',
      url: 'marche-public/marche'
    },
    {
      libelle: 'Marche Public',
      icon: 'fal fa-tachometer-alt-average',
      url: './dashboard'
    },
  ];

  linkCourrier: {libelle: string, icon: string, url: string}[] = [
    {
      libelle: 'Entrants',
      icon: 'fal fa-envelope',
      url: './courrier/entrant'
    },
    {
      libelle: 'Sortants',
      icon: 'fal fa-envelope-open',
      url: './courrier/sortant'
    },
    {
      libelle: 'Marche Public',
      icon: 'fal fa-balance-scale',
      url: './courrier/sortant'
    },
    {
      libelle: 'Marche Public',
      icon: 'fal fa-tachometer-alt-average',
      url: './dashboard'
    },
  ];

  constructor() { }

}
