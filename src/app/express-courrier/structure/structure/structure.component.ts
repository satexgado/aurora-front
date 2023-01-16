import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { StructureService } from './structure.service';
import { BaseContainerComponent } from './../../../shared/base-component/base-container.component';

@Component({
  selector: 'app-structure',
  templateUrl: './structure.component.html',
  styleUrls: ['./structure.component.scss'],
})
export class StructureComponent
  extends BaseContainerComponent
  implements OnInit
{
  constructor(
    public structureService: StructureService,
    public router: Router,
    public route: ActivatedRoute
  ) {
    super(structureService, router, route, 'structure');
  }

  ngOnInit(): void {
    this.watchStructure();

    this.subscriptions['created'] =
      this.structureService.lastItemcreated$.subscribe(() => {
        this.helper.modal.hide('structure-create-modal');
      });
  }

  watchStructure(): void {
    this.subscriptions['structure'] =
      this.structureService.singleData$.subscribe(() => {
        this.helper.modal.show('structure-preview-modal');
      });
  }
}
