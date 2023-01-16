import { MpMarcheFactory } from 'src/app/core/services/marche-public/marche.model';
import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-tableau-fournisseur',
  templateUrl: 'tableau-fournisseur.component.html',
  animations: [
    trigger('flyInOut', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => *', [
        style({ transform: 'translateX(-100%)' }),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})

export class TableauFournisseurComponent implements OnInit {
  loading= true;
  searchTerm: string;
  data;
  constructor() { }

  ngOnInit() {
    const something = new MpMarcheFactory();
    something.tableauxFournisseurs().subscribe
    (data=> {
      this.data = data;
      this.loading = false;
    });
   }

}
