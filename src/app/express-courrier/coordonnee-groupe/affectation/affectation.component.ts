import { CrCoordonneeFactory } from 'src/app/core/services/gestion-courrier/cr-coordonnee';
import { CacheService } from 'src/app/shared/services/cache.service';
import { Component, Input, ChangeDetectorRef} from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/components/edit/base-edit.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { map, shareReplay } from 'rxjs/operators';
import { StructureService } from 'src/app/express-courrier/structure/structure/structure.service';
import { Helper } from 'src/app/helpers/helper/helper';
import { QueryOptions, Sort } from 'src/app/shared/models/query-options';
import { ICrCoordonnee } from 'src/app/core/models/gestion-courrier/cr-coordonnee';
import { CrCoordonneeGroupe, ICrCoordonneeGroupe } from 'src/app/core/models/gestion-courrier/cr-coordonnee-groupe';
import { CrCoordonneeGroupeFactory } from 'src/app/core/services/gestion-courrier/cr-coordonnee-groupe';

@Component({
  selector: 'app-affectation-coordonnee-groupe',
  templateUrl: './affectation.component.html'
})
export class AffectationCoordonneeGroupeEditComponent extends BaseEditComponent  {
  heading = 'tache';
  @Input() item: CrCoordonneeGroupe = new CrCoordonneeGroupe();

  dependancies = {
    coordonnees: [],
  };

  dependanciesLoading = {
    coordonnees: false
  };

  protected readonly allCoordonnees$ = new CrCoordonneeFactory().list(new QueryOptions().setSort([new Sort('libelle','ASC')])).pipe(
    shareReplay(1),
    map(data => data.data)
    // map(data => data.data.filter( coordonnee => coordonnee.id != this.item?.inscription_id) as ICrCoordonnee[])
  );

  constructor(
    cdRef:ChangeDetectorRef,
    public structureService: StructureService,
    protected cacheService: CacheService,
    public helper2: Helper,
    activeModal: NgbActiveModal)
  {
    super(new CrCoordonneeGroupeFactory(),cdRef, activeModal);
  }

  createFormGroup(item: ICrCoordonneeGroupe) {
    return this.formBuilder.group({
      'cr_coordonnees': [item.cr_coordonnees && item.cr_coordonnees.length ? item.cr_coordonnees : [] ],
      'id': [item.id]
    });
  }

  public getCoordonnees(): void {
    this.dependanciesLoading.coordonnees = true;
    this.allCoordonnees$.subscribe((coordonnees: any) => {
      this.dependancies.coordonnees = coordonnees;
      this.dependanciesLoading.coordonnees = false;
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
      const service = new CrCoordonneeGroupeFactory();
      return service.setAffectations(id, relationData).subscribe(
        ()=> {
          this.item.cr_coordonnees = this.editForm.get('cr_coordonnees').value;
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
