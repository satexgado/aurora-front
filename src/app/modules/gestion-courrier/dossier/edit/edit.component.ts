import { Component, Input, ChangeDetectorRef} from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/components/edit/base-edit.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {  FormControl, Validators } from '@angular/forms';
import { CrDossier, ICrDossier } from 'src/app/core/models/gestion-courrier/cr-dossier';
import { CrDossierFactory } from 'src/app/core/services/gestion-courrier/cr-dossier';
import { StructureService } from 'src/app/express-courrier/structure/structure/structure.service';
import { AuthService } from 'src/app/express-courrier/auth/auth.service';
import { Helper } from 'src/app/helpers/helper/helper';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html'
})
export class EditComponent extends BaseEditComponent  {
  heading = 'dossier';
  @Input() item: CrDossier = new CrDossier();
  @Input() structure: any = null;
  dependancies = {
    structures: [],
  };

  dependanciesLoading = {
    structures: false,
  };

  // TODO: Revoir la recuperation des structures
  public getStructures(): void {
    if(this.dependancies.structures && this.dependancies.structures.length) {
      return;
    }
    this.dependanciesLoading.structures = true;
    this.structureService.getByUserWCountCourrier(this.authService.user.id).subscribe((structures: any) => {
      this.dependancies.structures = structures;
      this.dependanciesLoading.structures = false;
    });
  }

  constructor(
    cdRef:ChangeDetectorRef,
    public authService: AuthService,
    public structureService: StructureService,
    public helper2: Helper,
    activeModal: NgbActiveModal)
  {
    super(new CrDossierFactory(),cdRef, activeModal);
  }

  ngOnInit() {
    super.ngOnInit();
    this.onChange();
  }


  onChange() {
    const structureIdControl = this.editForm.get('structure_id') as FormControl;
    const structureControl = this.editForm.get('structure') as FormControl;
    structureControl.valueChanges.subscribe(
      (value)=>{
        if(value && value.length) {
          structureIdControl.setValue(value[0].id);
        } else {
          structureIdControl.setValue(null);
        }
        structureIdControl.markAsDirty();
        structureIdControl.markAsTouched();
      }
    )
  }

  createFormGroup(item: ICrDossier) {

    if(this.structure) {
      item.structure_id = this.structure.id;
      item.structure = this.structure;
    }

    return this.formBuilder.group({
      // 'structure_id': [item.structure_id, Validators.required],
      // 'responsable_id': [item.responsable_id, Validators.required],
      'structure': [item.structure ? [item.structure] : []],
      'structure_id': [item.structure_id, Validators.required],
      // 'objet': [item.objet, Validators.required],
      'libelle': [item.libelle, Validators.required],
      'id': [item.id]
    });
  }

}
