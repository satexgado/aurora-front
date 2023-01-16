import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { StructureSoloComponent } from '../../../structure-shared/structure-solo/structure-solo.component';
import { StructureService } from '../../../structure.service';

@Component({
  selector: 'app-sous-structure-solo',
  templateUrl: './sous-structure-solo.component.html',
  styleUrls: ['./sous-structure-solo.component.scss'],
})
export class SousStructureSoloComponent
  extends StructureSoloComponent
  implements OnInit
{
  constructor(public structureService: StructureService) {
    super(structureService);
  }

  ngOnInit(): void {}

  show(): void {}
}
