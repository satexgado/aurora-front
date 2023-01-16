import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BaseListComponent } from 'src/app/shared/base-component/base-list.component';
import { BaseComponent } from 'src/app/shared/base-component/base.component';
import { StructureService } from '../structure.service';

@Component({
  selector: 'app-structure-list',
  templateUrl: './structure-list.component.html',
  styleUrls: ['./structure-list.component.scss'],
})
export class StructureListComponent
  extends BaseListComponent
  implements OnInit
{
  constructor(
    public structureService: StructureService,
    public route: ActivatedRoute
  ) {
    super(structureService, route, 'structure', 8);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.route.queryParams.subscribe((params) => {
      this.getData(params);
    });

    this.subscriptions['mes-structures'] = this.service.data$.subscribe(
      (data) => {
        this.data = data;
      }
    );
  }

  // TODO: Revoir le comportement de la recheche
  /**
   * Le renvoie des données est erronés
   */
  getData(params: Params): void {
    this.loading = true;
    this.structureService.get({ emitData: true, params }).subscribe({
      next: () => {
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
