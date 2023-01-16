import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseComponent } from 'src/app/shared/base-component/base.component';
import { StructureService } from '../structure.service';

@Component({
  selector: 'app-structure-tree',
  templateUrl: './structure-tree.component.html',
  styleUrls: ['./structure-tree.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class StructureTreeComponent extends BaseComponent implements OnInit {
  @Input() structures: any[] = [];
  constructor(public structureService: StructureService) {
    super(structureService);
  }

  ngOnInit(): void {}
}
