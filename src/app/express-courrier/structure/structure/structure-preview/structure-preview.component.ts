import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseSingleComponent } from 'src/app/shared/base-component/base-single.component';
import { StructureService } from '../structure.service';

@Component({
  selector: 'app-structure-preview',
  templateUrl: './structure-preview.component.html',
  styleUrls: ['./structure-preview.component.scss'],
})
export class StructurePreviewComponent
  extends BaseSingleComponent
  implements OnInit
{
  onEdit = false;
  constructor(
    public structureService: StructureService,
    public route: ActivatedRoute,
    public router: Router
  ) {
    super(structureService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  edit(): void {
    this.structureService.structureToEdit$.next(this.single);
    this.helper.modal.toggle('structure-preview-modal');
    this.onEdit = true;
    this.router.navigate(['./'], {
      queryParamsHandling: 'preserve',
      fragment: 'edit-structure',
      relativeTo: this.route,
    });
  }
}
