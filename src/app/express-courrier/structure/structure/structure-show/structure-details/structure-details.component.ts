import { Component, OnInit } from '@angular/core';
import { BaseSingleComponent } from 'src/app/shared/base-component/base-single.component';
import { StructureService } from '../../structure.service';

@Component({
  selector: 'app-structure-details',
  templateUrl: './structure-details.component.html',
  styleUrls: ['./structure-details.component.scss'],
})
export class StructureDetailsComponent
  extends BaseSingleComponent
  implements OnInit
{
  constructor(public structureService: StructureService) {
    super(structureService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }
}
