import { RolesService } from './../roles.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BaseListComponent } from '../../../shared/base-component/base-list.component';
import { StructureService } from '../../structure/structure/structure.service';

@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.scss'],
})
export class RolesListComponent extends BaseListComponent implements OnInit {
  constructor(
    public roleService: RolesService,
    public route: ActivatedRoute,
    public structureService: StructureService
  ) {
    super(roleService, route, 'roles', 7);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.getAll();
    // this.subscriptions['structure'] =
    //   this.structureService.singleData$.subscribe((structure) => {
    //     this.route.queryParams.subscribe((params) => {
    //       this.getByStructure(structure.id!, params);
    //     });
    //   });
  }

  getByStructure(structure: number, params: Params): void {
    this.loading = true;
    this.roleService.getByStructure(structure, params).subscribe({
      error: () => {
        this.loading = false;
      },
      next: () => {
        this.loading = false;
      },
    });
  }

  getAll() {
    this.loading = true;
    this.roleService.get().subscribe(
      {
        error: () => {
          this.loading = false;
        },
        next: () => {
          this.loading = false;
        },
      }
    );
  }

  modifier(item: any): void {
    this.roleService.loading = true;
    this.roleService.show(item.id, true).subscribe(() => {
      this.roleService.loading = false;
    });
  }
}
