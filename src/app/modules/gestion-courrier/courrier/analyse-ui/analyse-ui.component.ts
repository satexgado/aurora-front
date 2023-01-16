import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-courrier-analyse-ui',
  templateUrl: 'analyse-ui.component.html'
})

export class AnalyseCourrierUiComponent implements OnInit {
  constructor(
    public route: ActivatedRoute,
  ) { }

  ngOnInit() { }
}
