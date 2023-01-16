import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseSingleComponent } from 'src/app/shared/base-component/base-single.component';
import { Structure } from '../../structure.model';
import { StructureService } from '../../structure.service';

@Component({
  selector: 'app-structure-messagerie',
  templateUrl: './structure-messagerie.component.html',
  styleUrls: ['./structure-messagerie.component.scss'],
})
export class StructureMessagerieComponent
  extends BaseSingleComponent<Structure>
  implements OnInit
{
  constructor(public structureService: StructureService) {
    super(structureService);
  }

  ngOnInit(): void {
    this.subscriptions['structure'] =
      this.structureService.singleData$.subscribe((structure) => {
        this.single = structure;
      });
  }
}
