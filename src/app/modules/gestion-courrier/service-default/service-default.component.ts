import { CrServiceDefaultFactory } from './../../../core/services/gestion-courrier/cr-service-default';
import { Component, OnInit} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditComponent } from './edit/edit.component';

import { AppTitleService, CacheService } from 'src/app/shared/services';
import { EditableListComponent } from 'src/app/shared';
import { ResourceScrollableHelper } from 'src/app/shared/state';
import { QueryOptions, Filter, Sort } from 'src/app/shared/models/query-options';
import { of } from 'rxjs';
import { ICrServiceDefault } from 'src/app/core/models/gestion-courrier/cr-service-default';

@Component({
  selector: 'app-service-default',
  templateUrl: './service-default.component.html',
  styles: [`
      tr {
        color: #095f79;
      }
  `]
})
export class ServiceDefaultComponent extends EditableListComponent implements OnInit {

  editModal = EditComponent;
  modalData: ICrServiceDefault;
  parentData: {relationName: string,relationId: number} = null;

  constructor(
    protected cacheService: CacheService,
    protected titleservice: AppTitleService,
    protected modalService: NgbModal) {
    super(new ResourceScrollableHelper(new CrServiceDefaultFactory()));
    this.titleservice.setTitle('mes ServiceDefaults')
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
          ['personnes', 'structure'],
          8,
          1
        );
        this.parentData = data;
        this.dataHelper = new ResourceScrollableHelper(new CrServiceDefaultFactory(), queryOptions);
        super.ngOnInit()
      },
      ()=>{
        super.ngOnInit();
        // this.dataHelper.sortColumn = 'libelle';
        // this.dataHelper.sortDirection = 'Asc';
        this.dataHelper.relations = ['personnes', 'structure'];
      }
    )
  }

  onShowCreateForm(item?, modal = this.editModal) {
    super.onShowCreateForm(item).subscribe(
       (data:ICrServiceDefault)=>{
         if(!this.parentData)  {return;}
         const service = new CrServiceDefaultFactory();
         service.attachAffectation(data.id, this.parentData.relationName+'s', this.parentData.relationId).subscribe();
       }
    )
    return of(true);
 }

 openModal(content, data: ICrServiceDefault) {
  this.modalData = data;
  this.modalService.open(content, { size: 'lg', centered: true,  backdrop: 'static' });
}
}
