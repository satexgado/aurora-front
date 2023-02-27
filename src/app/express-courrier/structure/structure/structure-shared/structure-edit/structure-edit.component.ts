import { StructureDependancies } from './../../structure.dependancies';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StructureTypeService } from '../../../structure-type.service';
import { StructureCreateComponent } from '../structure-create/structure-create.component';
import { StructureService } from '../../structure.service';
import { NgxPicaImageService, NgxPicaService } from '@digitalascetic/ngx-pica';
import { Validators } from '@angular/forms';

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
    public route: ActivatedRoute,
    public ngxPicaService: NgxPicaService,
    public ngxPicaImageService: NgxPicaImageService
  ) {
    super(structureService, dependancies, ngxPicaService, ngxPicaImageService);
  }

  ngOnInit(): void {
    super.ngOnInit();

    if (this.structureService.singleData) {
      this.structureService.singleData$.subscribe((structure) => {
        this.structure = structure;
        this.initForm(structure);
        this.imageUrl = this.structure.image;
      });
    }

    this.subscriptions['structure'] =
      this.structureService.structureToEdit$.subscribe((structure) => {
        this.structure = structure;
        this.initForm(structure);
        this.imageUrl = this.structure.image;
      });
  }

  initForm(structure?: any): void {
    this.form = this.fb.group({
      libelle: [structure?.libelle, Validators.required],
      type: [structure ? [structure.type] : null, [Validators.required]],
      cigle: [structure?.cigle, Validators.required],
      description: [structure?.description, Validators.required],
      parent: [structure && structure.structure_parent ? [structure.structure_parent] : null],
      // image: [structure?.libelle],
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

      this.fillFormData(data);

      this.structureService.update(this.structure.id, this.formData).subscribe(() => {
        this.loading = false;
        this.helper.notification.toastSuccess();
        this.helper.modal.hide('structure-edit-modal');
        this.helper.modal.show('structure-preview-modal');
        this.dependancies.data.structures = [];
        this.imageUrl = null;
      });
    } else {
      this.helper.notification.alertDanger('Formulaire invalide');
    }
  }
}
