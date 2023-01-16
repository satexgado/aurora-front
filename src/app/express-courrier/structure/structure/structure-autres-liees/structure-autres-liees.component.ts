import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BaseListComponent } from 'src/app/shared/base-component/base-list.component';
import { BaseComponent } from 'src/app/shared/base-component/base.component';
import { StructureService } from '../structure.service';

@Component({
  selector: 'app-structure-autres-liees',
  templateUrl: './structure-autres-liees.component.html',
  styleUrls: ['./structure-autres-liees.component.scss'],
})
export class StructureAutresLieesComponent
  extends BaseListComponent
  implements OnInit
{
  constructor(
    public structureService: StructureService,
    public route: ActivatedRoute
  ) {
    super(structureService, route, 'structure', 9);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.route.queryParams.subscribe((params) => {
      this.getData(params);
    });

    this.subscriptions['structure'] =
      this.structureService.autresStructures$.subscribe((data) => {
        this.data = [...data];
      });
  }

  getData(params: Params): void {
    this.loading = true;
    this.structureService.getAutresStructures(params).subscribe({
      next: () => {
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
