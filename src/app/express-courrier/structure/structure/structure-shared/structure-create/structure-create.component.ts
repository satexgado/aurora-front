import { StructureDependancies } from './../../structure.dependancies';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseCreateComponent } from 'src/app/shared/base-component/base-create.component';
import { StructureTypeService } from '../../../structure-type.service';
import { StructureService } from '../../structure.service';
import { NgxPicaImageService, NgxPicaService } from '@digitalascetic/ngx-pica';

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
  imageUrl: any;

  constructor(
    public structureService: StructureService,
    public dependancies: StructureDependancies,
    public ngxPicaService: NgxPicaService,
    public ngxPicaImageService: NgxPicaImageService
  ) {
    super(structureService);
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(structure?: any): void {
    let parent;
    if(this.ancestor) {
      parent = [this.ancestor];
    } else {
      parent = structure && structure.parent ? [structure.parent] : null;
    }

    this.form = this.fb.group({
      libelle: [structure?.libelle, Validators.required],
      type: [structure ? [structure.type] : null, [Validators.required]],
      cigle: [structure?.cigle, Validators.required],
      description: [structure?.description, Validators.required],
      parent: [parent, Validators.required],
      // image: [structure?.libelle],
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
          this.dependancies.data.structures = [];
          this.imageUrl = null;
        });
    } else {
      this.helper.notification.alertDanger('Formulaire invalide');
    }
  }

   // Chercher le type de change
   onFileChanged(event: any) {
    const files: File[] = event.target.files;

    if (files?.length && this.ngxPicaImageService.isImage(files[0])) {
      const image = files[0];
      this.formData.append('image', image);
      this.ngxPicaService
        .resizeImage(image, 150, 150)
        .subscribe((imageRetailler) => {
          // this.formData.append(
          //   'photo_min',
          //   new File([imageRetailler], imageRetailler.name, {
          //     type: imageRetailler.type,
          //   })
          // );

          this.displayImage(imageRetailler);
        });
    }
  }

  displayImage(image: File): void {
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      this.imageUrl = reader.result;
    };
  }
}
