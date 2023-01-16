import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-courriersorti',
  templateUrl: './courriersorti.component.html',
  styleUrls: ['./courriersorti.component.scss']
})
export class CourriersortiComponent implements OnInit {
  urlstructure='structdash/cr_courrier_sortants';
  urlnature='natudash/cr_courrier_sortants';
  urltype='typedash/cr_courrier_sortants';
  urlstatut='statutdash/cr_courrier_sortants';

  constructor() { }

  ngOnInit(): void {
  }

}
