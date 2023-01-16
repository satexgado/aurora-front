import { StructureDependancies } from './../../structure.dependancies';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseCreateComponent } from 'src/app/shared/base-component/base-create.component';
import { StructureTypeService } from '../../../structure-type.service';
import { StructureService } from '../../structure.service';

@Component({
  selector: 'app-structure-create',
  templateUrl: './structure-create.component.html',
  styleUrls: ['./structure-create.component.scss'],
})
export class StructureCreateComponent
  extends BaseCreateComponent
  implements OnInit
{
  @Input() ancestor: any;

  constructor(
    public structureService: StructureService,
    public dependancies: StructureDependancies
  ) {
    super(structureService);
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(structure?: any): void {
    this.form = this.fb.group({
      libelle: [structure?.libelle, Validators.required],
      type: [structure ? [structure.type] : null, [Validators.required]],
      cigle: [structure?.cigle, Validators.required],
      description: [structure?.description, Validators.required],
      parent: [structure && structure.parent ? [structure.parent] : null],
      image: [structure?.libelle],
    });
  }

  public getStructures(): void {
    if (!this.dependancies.data.structures.length) {
      if (this.ancestor) this._getStructureEtSousStructure(this.ancestor.id);
      else this.dependancies.getStructures();
    }
  }

  private _getStructureEtSousStructure(structure: number): void {
    this.dependancies.loading.structures = true;
    this.structureService.getStructureEtSousStructures(structure).subscribe({
      next: (response) => {
        this.dependancies.data.structures = response;
      },
      complete: () => {
        this.dependancies.loading.structures = false;
      },
    });
  }

  create(): void {
    if (this.form.valid) {
      this.loading = true;
      const data = {
        ...this.helper.object.omitField(this.form.value, ['parent']),
        parent_id: this.formValue('parent')[0].id,
        type: this.formValue('type')[0].id,
      };

      this.fillFormData(data);

      this.structureService
        .store(this.formData, !!!this.ancestor)
        .subscribe(() => {
          this.loading = false;
          this.created.emit();
          this.initForm();
          this.formData = new FormData();
          this.helper.notification.toastSuccess();
        });
    } else {
      this.helper.notification.alertDanger('Formulaire invalide');
    }
  }
}
