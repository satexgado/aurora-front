import { Component, OnInit } from '@angular/core';
import { BaseListComponent } from '../../../../shared/base-component/base-list.component';
import { FonctionService } from './../fonction.service';
import { ActivatedRoute } from '@angular/router';
import { StructureService } from './../../../structure/structure/structure.service';
import { Structure } from '../../../structure/structure/structure.model';

@Component({
  selector: 'app-fonction-list',
  templateUrl: './fonction-list.component.html',
  styleUrls: ['./fonction-list.component.scss'],
})
export class FonctionListComponent extends BaseListComponent implements OnInit {
  constructor(
    public fonctionService: FonctionService,
    public structureService: StructureService,
    public route: ActivatedRoute
  ) {
    super(fonctionService, route, 'fonctions', 8);
  }

  ngOnInit(): void {
    // this.subscriptions['structure'] =
    //   this.structureService.singleData$.subscribe((structure) => {
    //     this.getByStructure(structure);
    //   });
    this.getAll();
  }

  getByStructure(structure: Structure): void {
    this.loading = true;
    this.fonctionService.getByStructure(structure).subscribe({
      next: () => {
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  getAll() {
    this.loading = true;
    this.fonctionService.get().subscribe(
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
}
