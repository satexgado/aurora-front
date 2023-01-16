import { CacheService } from 'src/app/shared/services/cache.service';
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
  selector: 'app-affectation-tache',
  templateUrl: './affectation.component.html'
})
export class AffectationTacheEditComponent extends BaseEditComponent  {
  heading = 'tache';
  @Input() item: CrTache = new CrTache();

  dependancies = {
    structures: [],
    users: [],
  };

  dependanciesLoading = {
    structures: false,
    users: false
  };

  protected readonly allUsers$ = new UserFactory().list(new QueryOptions().setSort([new Sort('prenom','ASC'), new Sort('nom','ASC')])).pipe(
    shareReplay(1),
    map(data => data.data.filter( user => user.id != this.item?.inscription_id) as IUser[])
  );

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
      'responsables': [item.responsables && item.responsables.length ? item.responsables : [] ],
      'structures': [item.structures && item.structures.length ? item.structures : []],
      'id': [item.id]
    });
  }

  // TODO: Revoir la recuperation des structures
  public getStructures(): void {
    if(this.dependancies.structures && this.dependancies.structures.length) {
      return;
    }
    this.dependanciesLoading.structures = true;
    this.structureService.all(false).subscribe((structures: any) => {
      this.dependancies.structures = structures;
      this.dependanciesLoading.structures = false;
    });
  }

  public getUsers(): void {
    this.dependanciesLoading.users = true;
    this.allUsers$.subscribe((users: any) => {
      this.dependancies.users = users;
      this.dependanciesLoading.users = false;
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
          relationData[key] = value.map(
            (element)=>element.id
          )
        }
      );
      const service = new CrTacheFactory();
      return service.setAffectations(id, relationData).subscribe(
        ()=> {
          this.item.responsables = this.editForm.get('responsables').value;
          this.item.structures = this.editForm.get('structures').value;
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
