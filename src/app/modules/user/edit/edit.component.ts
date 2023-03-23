import { Component, Input, ChangeDetectorRef} from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/components/edit/base-edit.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {  FormControl, Validators } from '@angular/forms';
import { CrCoordonnee, ICrCoordonnee } from 'src/app/core/models/gestion-courrier/cr-coordonnee';
import { CrCoordonneeFactory } from 'src/app/core/services/gestion-courrier/cr-coordonnee';
import { ICrCoordonneeGroupe } from 'src/app/core/models/gestion-courrier/cr-coordonnee-groupe';
import { CrCoordonneeGroupeFactory } from 'src/app/core/services/gestion-courrier/cr-coordonnee-groupe';
import { QueryOptions, Sort } from 'src/app/shared/models/query-options';
import { CoordonneeValidator } from 'src/app/shared';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html'
})
export class EditComponent extends BaseEditComponent  {
  heading = 'coordonnee';
  @Input() item: CrCoordonnee = new CrCoordonnee();
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
  allGroupes: ICrCoordonneeGroupe[] = [];
  loading_groupes = true;
  multiParameter2 = {
    singleSelection: false,
    selectAllText: 'Tout selectionner',
    unSelectAllText: 'Tout deselectionner',
    itemsShowLimit: 5,
    labelKey: 'libelle',
    enableSearchFilter: true,
    tagToBody: true
  };
  constructor(
    cdRef:ChangeDetectorRef,
    activeModal: NgbActiveModal)
  {
    super(new CrCoordonneeFactory(),cdRef, activeModal);
  }

  ngOnInit() {
    const service = new CrCoordonneeGroupeFactory();
    service.list(new QueryOptions().setSort([new Sort('libelle', 'ASC')])).subscribe(
      (data)=> {
        this.allGroupes = data.data;
        this.loading_groupes = false;
      }
    );
    super.ngOnInit();
    this.onChange();
  }


  onChange() {
    const groupesIdControl = this.editForm.get('groupes_id') as FormControl;
    const groupesControl = this.editForm.get('groupes') as FormControl;
    groupesControl.valueChanges.subscribe(
      (value)=>{
        if(value && value.length) {
          groupesIdControl.setValue(value.map(el=>el.id));
        } else {
          groupesIdControl.setValue(null);
        }
        groupesIdControl.markAsDirty();
        groupesIdControl.markAsTouched();
      }
    )
  }

  createFormGroup(item: ICrCoordonnee) {
    return this.formBuilder.group({
      'groupes': [item.groupes ? item.groupes : []],
      'groupes_id': [item.groupes && item.groupes.length ? item.groupes.map(el=>el.id) : null],
      'tag': [item.tag, Validators.required],
      'email': [item.email, Validators.required, CoordonneeValidator.alreadyUsedEmailValidator(item.email)],
      'telephone': [item.telephone, Validators.required],
      'adresse': [item.adresse, Validators.required],
      'condition_suivi': [item.condition_suivi],
      'commentaire': [item.commentaire],
      'libelle': [item.libelle, Validators.required],
      'id': [item.id]
    });
  }
}
