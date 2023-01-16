import { Component, OnInit } from '@angular/core';
import { BaseListComponent } from '../../../../shared/base-component/base-list.component';
import { PosteService } from './../../../configurations/poste/poste.service';
import { ActivatedRoute } from '@angular/router';
import { StructureService } from '../../../structure/structure/structure.service';
import { Structure } from '../../../structure/structure/structure.model';

@Component({
  selector: 'app-poste-list',
  templateUrl: './poste-list.component.html',
  styleUrls: ['./poste-list.component.scss'],
})
export class PosteListComponent extends BaseListComponent implements OnInit {
  constructor(
    public posteService: PosteService,
    public structureService: StructureService,
    public route: ActivatedRoute
  ) {
    super(posteService, route, 'postes', 8);
  }

  ngOnInit(): void {
    this.subscriptions['structure'] =
      this.structureService.singleData$.subscribe((structure) => {
        this.getByStructure(structure);
      });
  }

  getByStructure(structure: Structure): void {
    this.loading = true;
    this.posteService.getByStructure(structure).subscribe({
      next: () => {
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
