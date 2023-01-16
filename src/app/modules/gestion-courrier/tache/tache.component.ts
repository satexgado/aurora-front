import { CrTacheFactory } from './../../../core/services/gestion-courrier/cr-tache';
import { Component, OnInit} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditComponent } from './edit/edit.component';

import { AppTitleService, CacheService } from 'src/app/shared/services';
import { EditableListComponent } from 'src/app/shared';
import { ResourceScrollableHelper } from 'src/app/shared/state';
import { QueryOptions, Filter, Sort } from 'src/app/shared/models/query-options';
import { of } from 'rxjs';
import { ICrTache } from 'src/app/core/models/gestion-courrier/cr-tache';

@Component({
  selector: 'app-tache',
  templateUrl: './tache.component.html'
})
export class TacheComponent extends EditableListComponent implements OnInit {

  editModal = EditComponent;
  modalData: ICrTache;
  parentData: {relationName: string,relationId: number} = null;

  constructor(
    protected cacheService: CacheService,
    protected titleservice: AppTitleService,
    protected modalService: NgbModal) {
    super(new ResourceScrollableHelper(new CrTacheFactory()));
    this.titleservice.setTitle('mes Taches')
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
          ['responsable', 'structure'],
          8,
          1,
          [new Sort('updated_at','DESC')]
        );
        this.parentData = data;
        this.dataHelper = new ResourceScrollableHelper(new CrTacheFactory(), queryOptions);
        super.ngOnInit()
      },
      ()=>{
        super.ngOnInit();
      }
    )
  }

  onShowCreateForm(item?, modal = this.editModal) {
    super.onShowCreateForm(item).subscribe(
       (data:ICrTache)=>{
         if(!this.parentData)  {return;}
         const service = new CrTacheFactory();
         service.attachAffectation(data.id, this.parentData.relationName+'s', this.parentData.relationId).subscribe();
       }
    )
    return of(true);
 }

 openModal(content, data: ICrTache) {
  this.modalData = data;
  this.modalService.open(content, { size: 'lg', centered: true,  backdrop: 'static' });
}
}
