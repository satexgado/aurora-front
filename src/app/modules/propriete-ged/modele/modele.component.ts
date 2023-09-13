import { Component, OnInit} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditComponent } from './edit/edit.component';

import { AppTitleService, CacheService } from 'src/app/shared/services';
import { EditableListComponent } from 'src/app/shared';
import { ResourceScrollableHelper } from 'src/app/shared/state';
import { QueryOptions, Filter, Sort } from 'src/app/shared/models/query-options';
import { of } from 'rxjs';
import { IGedModele } from 'src/app/core/models/gestion-document/ged-modele.model';
import { GedModeleFactory } from 'src/app/core/services/gestion-document/ged-modele.factory';

@Component({
  selector: 'app-modele',
  templateUrl: './modele.component.html'
})
export class ModeleComponent extends EditableListComponent implements OnInit {

  editModal = EditComponent;
  modalData: IGedModele;
  parentData: {relationName: string,relationId: number} = null;

  constructor(
    protected cacheService: CacheService,
    protected titleservice: AppTitleService,
    protected modalService: NgbModal) {
    super(new ResourceScrollableHelper(new GedModeleFactory()));
    this.titleservice.setTitle('mes Modeles')
    this.modalService = modalService;
  }

  ngOnInit() {
    this.cacheService.get('affectation-parent').subscribe(
      (data: {relationName: string,relationId: number})=>{
        const queryOptions = new QueryOptions(
          [
              {or: false, filters:[new Filter('isIns', true, 'eq')]},
              {or: false, filters: [new Filter(`${data.relationName}_by_id`, data.relationId, 'eq')]}
          ],
          [],
          8,
          1,
          [new Sort('libelle','Asc')]
        );
        this.dataHelper.relations = ['ged_modele_form_fields', 'structure'];
        this.parentData = data;
        this.dataHelper = new ResourceScrollableHelper(new GedModeleFactory(), queryOptions);
        super.ngOnInit()
      },
      ()=>{
        super.ngOnInit();
        this.dataHelper.relations = ['ged_modele_form_fields', 'structure'];
        this.dataHelper.sortColumn = 'libelle';
        this.dataHelper.sortDirection = 'Asc';
      }
    )
  }

  onShowCreateForm(item?, modal = this.editModal) {
    super.onShowCreateForm(item).subscribe(
       (data:IGedModele)=>{
         if(!this.parentData)  {return;}
         const service = new GedModeleFactory();
         service.attachAffectation(data.id, this.parentData.relationName+'s', this.parentData.relationId).subscribe();
       }
    )
    return of(true);
 }

 openModal(content, data: IGedModele) {
  this.modalData = data;
  this.modalService.open(content, { size: 'lg', centered: true,  backdrop: 'static' });
}

  onSwitchStatut(){

  }

}
