import { CrTacheFactory } from 'src/app/core/services/gestion-courrier/cr-tache';
import { CrTache, CrTacheStatut, ICrTache } from 'src/app/core/models/gestion-courrier/cr-tache';
import { Component, Input, ChangeDetectorRef} from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/components/edit/base-edit.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Validators, FormControl } from '@angular/forms';
import { of } from 'rxjs';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html'
})
export class TacheStatutEditComponent extends BaseEditComponent  {
  heading = 'statut';
  @Input() item: CrTache = new CrTache();
  statut$ = of(
  [
    {id: CrTacheStatut.attente, libelle: 'En attente'},
    {id: CrTacheStatut.traitement, libelle: 'Traitement en cours'},
    {id: CrTacheStatut.valide, libelle: 'Valide'},
    {id: CrTacheStatut.nonvalide, libelle: 'Non valide'}
  ]
  )
  constructor(
    cdRef:ChangeDetectorRef,
    activeModal: NgbActiveModal)
  {
    super(new CrTacheFactory(),cdRef, activeModal);
  }

  createFormGroup(item: ICrTache) {
    return this.formBuilder.group({
      'statut': [item.statut, Validators.required],
      'id': [item.id]
    });
  }

}
