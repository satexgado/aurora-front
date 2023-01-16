import { Component, Input, OnInit } from '@angular/core';
import { TunelService } from 'src/app/express-courrier/messagerie/tunel/tunel.service';
import { BaseComponent } from 'src/app/shared/base-component/base.component';
import { StructureService } from '../../structure.service';

@Component({
  selector: 'app-structure-solo',
  templateUrl: './structure-solo.component.html',
  styleUrls: ['./structure-solo.component.scss'],
})
export class StructureSoloComponent extends BaseComponent implements OnInit {
  @Input() structure: any;
  @Input() isUserEmploye: boolean = false;
  constructor(
    public structureService: StructureService,
    public tunelService?: TunelService
  ) {
    super(structureService);
  }

  ngOnInit(): void {}

  show() {
    this.structureService.show(this.structure.id, true).subscribe();
  }

  edit(): void {
    this.structureService.singleData = this.structure;
    this.helper.modal.show('structure-edit-modal');
  }

  delete(): void {
    this.helper.notification.confirm(() => {
      this.loading = true;
      this.structureService.delete(this.structure.id).subscribe(() => {
        this.loading = false;
      });
    });
  }

  tunel() {
    this.tunelService.getTunel(this.structure.id, 2);
  }
}
