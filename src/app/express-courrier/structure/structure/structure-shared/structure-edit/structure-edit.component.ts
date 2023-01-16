import { StructureDependancies } from './../../structure.dependancies';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StructureTypeService } from '../../../structure-type.service';
import { StructureCreateComponent } from '../structure-create/structure-create.component';
import { StructureService } from '../../structure.service';

@Component({
  selector: 'app-structure-edit',
  templateUrl: './structure-edit.component.html',
  styleUrls: ['./structure-edit.component.scss'],
})
export class StructureEditComponent
  extends StructureCreateComponent
  implements OnInit
{
  structure: any;
  constructor(
    public structureService: StructureService,
    public dependancies: StructureDependancies,
    public route: ActivatedRoute
  ) {
    super(structureService, dependancies);
  }

  ngOnInit(): void {
    super.ngOnInit();

    if (this.structureService.singleData) {
      this.structureService.singleData$.subscribe((structure) => {
        this.structure = structure;
        this.initForm(structure);
      });
    }

    this.subscriptions['structure'] =
      this.structureService.structureToEdit$.subscribe((structure) => {
        this.structure = structure;
        this.initForm(structure);
      });
  }

  edit(): void {
    if (this.form.valid) {
      this.loading = true;
      const data = {
        ...this.helper.object.omitField(this.form.value, ['parent']),
        parent_id: this.formValue('parent')?.length
          ? this.formValue('parent')[0].id
          : null,
        type: this.formValue('type')[0].id,
      };

      this.structureService.update(this.structure.id, data).subscribe(() => {
        this.loading = false;
        this.helper.notification.toastSuccess();
        this.helper.modal.hide('structure-edit-modal');
        this.helper.modal.show('structure-preview-modal');
      });
    } else {
      this.helper.notification.alertDanger('Formulaire invalide');
    }
  }
}
