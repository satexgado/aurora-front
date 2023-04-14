import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { TunelService } from 'src/app/express-courrier/messagerie/tunel/tunel.service';
import { BaseComponent } from 'src/app/shared/base-component/base.component';
import { StructureService } from '../../structure.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppInjector } from 'src/app/shared/services';

@Component({
  selector: 'app-structure-solo',
  templateUrl: './structure-solo.component.html',
  styleUrls: ['./structure-solo.component.scss'],
})
export class StructureSoloComponent extends BaseComponent implements OnInit {
  @Input() structure: any;
  @Input() isUserEmploye: boolean = false;
  // @ViewChild('updateLink') updateLink: ElementRef;

  constructor(
    public structureService: StructureService,
    public tunelService?: TunelService,
  ) {
    super(structureService);
    const injector = AppInjector.getInjector();
  }

  ngOnInit(): void {

  }

  show() {
    this.structureService.singleData = this.structure;
    this.structureService.show(this.structure.id, true).subscribe(
      (data)=> {
      }
    );
  }

  edit(): void {
    // this.structureService.singleData = this.structure;
    // this.structureService.structureToEdit$.next(this.structure);
    // this.helper.modal.toggle('structure-edit-modal');
    // this.updateLink.nativeElement.click();
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
