import { Component, OnInit } from '@angular/core';
import { Helper } from 'src/app/helpers/helper/helper';

@Component({
  selector: '[app-sidebar-courrier]',
  templateUrl: 'sidebar-courrier.component.html'
})

export class SidebarCourrierComponent implements OnInit {
  constructor(public helper: Helper) { }

  ngOnInit() { }
}
