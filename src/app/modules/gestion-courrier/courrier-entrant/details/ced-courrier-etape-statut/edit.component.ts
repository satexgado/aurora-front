import { ICrCourrierEtape } from 'src/app/core/models/gestion-courrier/cr-courrier-etape';
import { CrCourrierEtapeFactory } from 'src/app/core/services/gestion-courrier/cr-courrier-etape';
import { CrCourrierEtape } from './../../../../../core/models/gestion-courrier/cr-courrier-etape';
import { Component, Input, ChangeDetectorRef} from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/components/edit/base-edit.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Validators, FormControl } from '@angular/forms';
import { of } from 'rxjs';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html'
})
export class CourrierEtapeStatutEditComponent extends BaseEditComponent  {
  heading = 'statut';
  @Input() item: CrCourrierEtape = new CrCourrierEtape();
  statut$ = of(
  [
    {id: 'En attente', libelle: 'En attente'},
    {id: 'Validé', libelle: 'Validé'},
    {id: 'Non validé', libelle: 'Non validé'}
  ]
  )
  constructor(
    cdRef:ChangeDetectorRef,
    activeModal: NgbActiveModal)
  {
    super(new CrCourrierEtapeFactory(),cdRef, activeModal);
  }

  createFormGroup(item: ICrCourrierEtape) {
    return this.formBuilder.group({
      'commentaire': [item.commentaire],
      'statut': [item.statut, Validators.required],
      'id': [item.id]
    });
  }

}
