import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-courrierinterne',
  templateUrl: './courrierinterne.component.html',
  styleUrls: ['./courrierinterne.component.scss']
})
export class CourrierinterneComponent implements OnInit {
  urlstructure='structdash/cr_courrier_internes';
  urlnature='natudash/cr_courrier_internes';
  urltype='typedash/cr_courrier_internes';
  urlstatut='statutdash/cr_courrier_internes';

  constructor() { }

  ngOnInit(): void {
  }

}
