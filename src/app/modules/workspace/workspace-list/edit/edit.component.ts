import { Component, Input, ChangeDetectorRef} from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/components/edit/base-edit.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, Validators, FormControl } from '@angular/forms';
import { JsonFormControlEnum } from 'src/app/core/models/json-form/json-form-control';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { GedWorkspace, IGedWorkspace } from 'src/app/core/models/gestion-document/ged-workspace.model';
import { GedWorkspaceFactory } from 'src/app/core/services/gestion-document/ged-workspace.factory';
import { NgxPicaImageService, NgxPicaService } from '@digitalascetic/ngx-pica';
import { CacheService } from 'src/app/shared/services';
import { StructureService } from 'src/app/express-courrier/structure/structure/structure.service';
import { AuthService } from 'src/app/express-courrier/auth/auth.service';
import { Helper } from 'src/app/helpers/helper/helper';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  animations: [
    trigger('flyInOut', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => *', [
        style({ transform: 'translateX(-100%)' }),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class EditComponent extends BaseEditComponent  {
  heading = 'nature';
  @Input() item: IGedWorkspace = new GedWorkspace();
  typeEnum = JsonFormControlEnum;
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
    activeModal: NgbActiveModal,
    public ngxPicaService: NgxPicaService,
    public ngxPicaImageService: NgxPicaImageService,
    public structureService: StructureService,
    public authService: AuthService,
    public helper2: Helper,
    protected cacheService: CacheService)
  {
    super(new GedWorkspaceFactory(),cdRef, activeModal);
  }

  ngOnInit(): void {
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


  createFormGroup(item: IGedWorkspace) {

  
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
      'image': [item.image, Validators.required ],
      'public': [item.public ],
      'description': [item.description],
      'libelle': [item.libelle, Validators.required],
      'id': [item.id]
    });
  }
}
