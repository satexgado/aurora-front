import { Component, Input, ChangeDetectorRef} from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/components/edit/base-edit.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {  FormControl, Validators } from '@angular/forms';
import { GedDossierAdministratif, IGedDossierAdministratif } from 'src/app/core/models/gestion-document/ged-dossier-administratif.model';
import { GedDossierAdministratifFactory } from 'src/app/core/services/gestion-document/ged-dossier-administratif.factory';
import { StructureService } from 'src/app/express-courrier/structure/structure/structure.service';
import { AuthService } from 'src/app/express-courrier/auth/auth.service';
import { Helper } from 'src/app/helpers/helper/helper';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html'
})
export class GedDossierAdministratifEditComponent extends BaseEditComponent  {
  heading = 'dossier-administratif';
  @Input() item: GedDossierAdministratif = new GedDossierAdministratif();
  @Input() structure: any = null;
  dependancies = {
    structures: [],
  };

  dependanciesLoading = {
    structures: false,
  };

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
    super(new GedDossierAdministratifFactory(),cdRef, activeModal);
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


  createFormGroup(item: IGedDossierAdministratif) {
    let structure_id ;
    let structure ;

    if(this.structure) {
      structure_id = this.structure.id;
      structure = this.structure;
    } else {
      structure_id = item.structure_id;
      structure = item.structure;
    }

    return this.formBuilder.group({
      'structure': [structure ? [structure] : []],
      'structure_id': [structure_id, Validators.required],
      'description': [item.description],
      'libelle': [item.libelle, Validators.required],
      'id': [item.id]
    });
  }
}
