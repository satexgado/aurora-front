import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseContainerComponent } from 'src/app/shared/base-component/base-container.component';
import { BaseComponent } from 'src/app/shared/base-component/base.component';
import { StructureService } from '../../structure.service';

@Component({
  selector: 'app-structure-sous-structure',
  templateUrl: './structure-sous-structure.component.html',
  styleUrls: ['./structure-sous-structure.component.scss'],
})
export class StructureSousStructureComponent
  extends BaseContainerComponent
  implements OnInit
{
  structure: any;
  constructor(
    public structureService: StructureService,
    public route: ActivatedRoute,
    public router: Router
  ) {
    super(structureService, router, route, 'structure');
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.subscriptions['structure'] =
      this.structureService.singleData$.subscribe((structure) => {
        this.structure = structure;
      });
  }
}
