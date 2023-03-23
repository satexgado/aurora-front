import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourrierUiService } from './courrier-ui.service';

@Component({
  selector: 'app-courrier-ui',
  templateUrl: 'courrier-ui.component.html',
  styles: [`
    .card-1-hoverable:hover {
      transition: all 3s cubic-bezier(.25, .8, .25, 1);
      box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    }

    .nav-link3.active {
      background-color: antiquewhite;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    }
  `]
})

export class CourrierUiComponent implements OnInit {

  constructor(
    public service: CourrierUiService,
    public route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() { 
  
  }

}
