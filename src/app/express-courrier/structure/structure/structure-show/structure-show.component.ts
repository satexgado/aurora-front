import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseSingleComponent } from 'src/app/shared/base-component/base-single.component';
import { StructureService } from '../structure.service';

@Component({
  selector: 'app-structure-show',
  templateUrl: './structure-show.component.html',
  styleUrls: ['./structure-show.component.scss'],
})
export class StructureShowComponent
  extends BaseSingleComponent
  implements OnInit, AfterViewInit
{
  edit = false;
  constructor(
    public structureService: StructureService,
    public route: ActivatedRoute,
    public router: Router
  ) {
    super(structureService);
  }

  ngOnInit(): void {
    this.enableFetchDataFromURL = true;
    super.ngOnInit();
  }

  ngAfterViewInit(): void {
    this.route.fragment.subscribe((fragment) => {
      if (fragment === `edit-structure`) {
        if (this.service.singleData) {
          this.edit = true;
          this.structureService.singleData = this.single;
          this.helper.modal.show(`structure-edit-modal`);
        } else {
          this.router.navigate(['./'], {
            relativeTo: this.route,
            queryParamsHandling: 'preserve',
          });
        }
      }
    });
  }

  onEdited() {
    this.edit = false;
    this.helper.modal.hide('struture-edit-modal');
  }
}
