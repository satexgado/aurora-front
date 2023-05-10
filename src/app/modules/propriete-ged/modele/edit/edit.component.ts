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
import { GedModele, IGedModele } from 'src/app/core/models/gestion-document/ged-modele.model';
import { GedModeleFactory } from 'src/app/core/services/gestion-document/ged-modele.factory';
import { NgxPicaImageService, NgxPicaService } from '@digitalascetic/ngx-pica';
import { requiredFileType } from 'src/app/shared/upload-file.validator';
import { IFichierType } from 'src/app/core/models/gestion-document/fichier-type.model';
import { CacheService } from 'src/app/shared/services';
import { FichierTypeFactory } from 'src/app/core/services/gestion-document/fichier-type.factory';
import { QueryOptions, Sort } from 'src/app/shared/models/query-options';
import { map, shareReplay } from 'rxjs/operators';


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
  @Input() item: IGedModele = new GedModele();
  typeEnum = JsonFormControlEnum;
  allTypeFichiers: IFichierType[] = [];

  tagList = [
    {
      id: 'fournisseur',
      libelle: 'fournisseur'
    },
    {
      id: 'partenaire',
      libelle: 'partenaire'
    }
  ]

  constructor(
    cdRef:ChangeDetectorRef,
    activeModal: NgbActiveModal,
    public ngxPicaService: NgxPicaService,
    public ngxPicaImageService: NgxPicaImageService,
    protected cacheService: CacheService)
  {
    super(new GedModeleFactory(),cdRef, activeModal);
  }

  ngOnInit(): void {
    this.cacheService.get(
      'allTypeFichiers',
      new FichierTypeFactory().list(new QueryOptions().setSort([new Sort('libelle','ASC')])).pipe(
        shareReplay(1),
        map(data => data.data)
      ),
      1800000
    ).subscribe(
      (data)=> {
        this.allTypeFichiers = data;
      }
    )

    super.ngOnInit();
  }

  createFormGroup(item: IGedModele) {

    let form_fields =   this.formBuilder.array([]);

    if(item.form_fields && item.form_fields.length) {
      item.form_fields.forEach(
        (field)=> {
          form_fields.push(this.formBuilder.group({
            'required': [field.required, Validators.required],
            'name': [field.libelle, Validators.required],
            'type': [field.type, Validators.required],
            id: [field.id]
          }))
        }
      )
    }

    return this.formBuilder.group({
      'removedFormField': [],
      'form_field': form_fields,
      'image': [item.image, [Validators.required, requiredFileType(['png', 'gif', 'jpeg', 'jpg', 'svg'])] ],
      'allowed_type': [item.allowed_type, Validators.required],
      'description': [item.description],
      'libelle': [item.libelle, Validators.required],
      'id': [item.id]
    });
  }

  addFormField() {
    const control = this.editForm.get('form_field') as FormArray;
    control.push(this.formBuilder.group({
      'required': [true, Validators.required],
      'name': ['', Validators.required],
      'type': ['', Validators.required],
      id: [0]
    }));
  }

  removeFormField(child_index) {
    const control = this.editForm.get('form_field') as FormArray;
    control.markAsDirty();
    if(control.at(child_index).get('id').value) {
      const removeControl = this.editForm.get('removedFormField') as FormControl;
      let data = removeControl.value ? removeControl.value : [];
      data.push(control.at(child_index).get('id').value);
      removeControl.setValue(data);
    }
    control.removeAt(child_index);
 }

 
 onImageChange() {
    const control = this.editForm.get('image');
    let sub = this.editForm.get('image').valueChanges
      .subscribe(type => {
        control.markAsDirty();
      });
  }
}
