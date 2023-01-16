import { Component, OnInit } from '@angular/core';
import { BaseContainerComponent } from './../../../shared/base-component/base-container.component';
import { PosteService } from './../../configurations/poste/poste.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-poste',
  templateUrl: './poste.component.html',
  styleUrls: ['./poste.component.scss'],
})
export class PosteComponent extends BaseContainerComponent implements OnInit {
  constructor(
    public posteService: PosteService,
    public router: Router,
    public route: ActivatedRoute
  ) {
    super(posteService, router, route, 'postes');
  }
}
