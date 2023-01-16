import { CacheService } from 'src/app/shared/services/cache.service';
import { Component, Input, ChangeDetectorRef} from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/components/edit/base-edit.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StructureService } from 'src/app/express-courrier/structure/structure/structure.service';
import { Helper } from 'src/app/helpers/helper/helper';
import { CrCourrier, ICrCourrier } from 'src/app/core/models/gestion-courrier/cr-courrier';
import { CrCourrierFactory } from 'src/app/core/services/gestion-courrier/cr-courrier';

@Component({
  selector: 'app-affectation-tache',
  templateUrl: './affectation.component.html'
})
export class AffectationCourrierEditComponent extends BaseEditComponent  {
  heading = 'tache';
  @Input() item: CrCourrier = new CrCourrier();

  dependancies = {
    structures: [],
  };

  dependanciesLoading = {
    structures: false,
  };

  constructor(
    cdRef:ChangeDetectorRef,
    public structureService: StructureService,
    protected cacheService: CacheService,
    public helper2: Helper,
    activeModal: NgbActiveModal)
  {
    super(new CrCourrierFactory(),cdRef, activeModal);
  }

  createFormGroup(item: ICrCourrier) {
    return this.formBuilder.group({
      'structure_copie_traitements': [item.structure_copie_traitements && item.structure_copie_traitements.length ? item.structure_copie_traitements : [] ],
      'structure_copie_informations': [item.structure_copie_informations && item.structure_copie_informations.length ? item.structure_copie_informations : []],
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
      const service = new CrCourrierFactory();
      return service.setAffectations(id, relationData).subscribe(
        ()=> {
          this.item.structure_copie_traitements = this.editForm.get('structure_copie_traitements').value;
          this.item.structure_copie_informations = this.editForm.get('structure_copie_informations').value;
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
