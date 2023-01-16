import { StructureService } from './../../../structure.service';
import { Component, OnInit } from '@angular/core';
import { BaseListComponent } from '../../../../../../shared/base-component/base-list.component';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-structure-sous-structure-list',
  templateUrl: './structure-sous-structure-list.component.html',
  styleUrls: ['./structure-sous-structure-list.component.scss'],
})
export class StructureSousStructureListComponent
  extends BaseListComponent
  implements OnInit
{
  constructor(
    public structureService: StructureService,
    public route: ActivatedRoute
  ) {
    super(structureService, route, 'sous-structure', 6);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.subscriptions['structure'] =
      this.structureService.singleData$.subscribe((structure) => {
        this.route.queryParams.subscribe((params) => {
          this.getAllSousStructures(structure.id!, params);
        });
      });

    // TODO: Revoir l'affichage des structures nouvelement crée
    this.subscriptions['structureCreated'] =
      this.structureService.lastItemcreated$.subscribe((item) => {
        this.data.unshift(item);
      });
  }

  getAllSousStructures(structure: number, params: Params): void {
    this.loading = true;
    this.structureService.getAllSousStructures(structure, params).subscribe({
      next: (response) => {
        this.data = response;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
