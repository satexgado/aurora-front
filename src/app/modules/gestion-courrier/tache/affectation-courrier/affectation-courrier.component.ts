 ;import { CacheService } from 'src/app/shared/services/cache.service';
import { Component, Input, ChangeDetectorRef} from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/components/edit/base-edit.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CrTache, ICrTache } from 'src/app/core/models/gestion-courrier/cr-tache';
import { CrTacheFactory } from 'src/app/core/services/gestion-courrier/cr-tache';
import { map, shareReplay } from 'rxjs/operators';
import { UserFactory } from 'src/app/core/services/user.factory';
import { IUser } from 'src/app/core/models/user';
import { StructureService } from 'src/app/express-courrier/structure/structure/structure.service';
import { Helper } from 'src/app/helpers/helper/helper';
import { QueryOptions, Sort } from 'src/app/shared/models/query-options';

@Component({
  selector: 'app-affectation-courrier-tache',
  templateUrl: './affectation-courrier.component.html'
})
export class AffectationTacheCourrierEditComponent extends BaseEditComponent  {
  heading = 'tache';
  @Input() item: CrTache = new CrTache();

  constructor(
    cdRef:ChangeDetectorRef,
    public structureService: StructureService,
    protected cacheService: CacheService,
    public helper2: Helper,
    activeModal: NgbActiveModal)
  {
    super(new CrTacheFactory(),cdRef, activeModal);
  }

  createFormGroup(item: ICrTache) {
    return this.formBuilder.group({
      // 'courrier': [null],
      'courriers': [item.courriers && item.courriers.length ? item.courriers[0] : null ],
      'id': [item.id]
    });
  }

  doUpdateItem(closeModalAfter: boolean = true) {
    // return only dirty controller values as array except id
    const updatedFields = this.helper.getDirtyState(this.editForm, new Set(['id']));
    if (Object.keys(updatedFields).length) {
      let id = this.editForm.get('id').value;
      let relationData = {};
      Object.entries(updatedFields).forEach(
        ([key, value]) => {
          if(key=='id') {
            return;
          }
          relationData[key] = value ? [value.id] : [];
        }
      );
      const service = new CrTacheFactory();
      return service.setAffectations(id, relationData).subscribe(
        ()=> {
          this.item.courriers = this.editForm.get('courriers').value ? [this.editForm.get('courriers').value] : [];
          this.newItem.emit(this.item);
          this.isLoading = false;
          this.editForm.markAsPristine();
          this.editForm.markAsUntouched();
          this.notificationService.onSuccess('Toutes les modifications ont été enregistré');
          if(closeModalAfter){
            this.onCloseModal('done');
          }
          this.isLoading = false;

        },  error => {
          if (error.status == 500) {
            this.notificationService.onError('Impossible d\'éffectuer cette requête');
            this.isLoading = false;
          }
        }
      )
    }
  }
}
