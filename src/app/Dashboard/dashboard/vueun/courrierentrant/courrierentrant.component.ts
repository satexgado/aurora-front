import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-courrierentrant',
  templateUrl: './courrierentrant.component.html',
  styleUrls: ['./courrierentrant.component.scss']
})
export class CourrierentrantComponent implements OnInit {
  urlstructure='structdash/cr_courrier_entrants';
  urlnature='natudash/cr_courrier_entrants';
  urltype='typedash/cr_courrier_entrants';
  urlstatut='statutdash/cr_courrier_entrants';

  constructor() { }

  ngOnInit(): void {
  }

}
