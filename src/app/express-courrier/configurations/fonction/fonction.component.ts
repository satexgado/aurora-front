import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseContainerComponent } from './../../../shared/base-component/base-container.component';
import { FonctionService } from './fonction.service';

@Component({
  selector: 'app-fonction',
  templateUrl: './fonction.component.html',
  styleUrls: ['./fonction.component.scss'],
})
export class FonctionComponent
  extends BaseContainerComponent
  implements OnInit
{
  constructor(
    public fonctionService: FonctionService,
    public router: Router,
    public route: ActivatedRoute
  ) {
    super(fonctionService, router, route, 'fonctions');
  }
}
