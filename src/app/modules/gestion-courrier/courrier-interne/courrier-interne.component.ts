import { CrCourrierInterneFactory } from './../../../core/services/gestion-courrier/cr-courrier-interne';
import { Component, OnInit} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditComponent } from './edit/edit.component';

import { AppTitleService, CacheService } from 'src/app/shared/services';
import { EditableListComponent } from 'src/app/shared';
import { ResourceScrollableHelper } from 'src/app/shared/state';
import { QueryOptions, Filter, Sort } from 'src/app/shared/models/query-options';
import { of } from 'rxjs';
import { ICrCourrierInterne } from 'src/app/core/models/gestion-courrier/cr-courrier-interne';

@Component({
  selector: 'app-courrier-interne',
  templateUrl: './courrier-interne.component.html'
})
export class CourrierInterneComponent extends EditableListComponent implements OnInit {

  editModal = EditComponent;
  parentData: {relationName: string,relationId: number} = null;

  constructor(
    protected cacheService: CacheService,
    protected titleservice: AppTitleService,
    protected modalService: NgbModal) {
    super(new ResourceScrollableHelper(new CrCourrierInterneFactory()));
    this.titleservice.setTitle('mes CourrierInternes')
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
          [new Sort('updated_at','DESC')]
        );
        this.parentData = data;
        this.dataHelper = new ResourceScrollableHelper(new CrCourrierInterneFactory(), queryOptions);
        super.ngOnInit()
      },
      ()=>{
        super.ngOnInit();
      }
    )
  }

  onShowCreateForm(item?, modal = this.editModal) {
    super.onShowCreateForm(item).subscribe(
       (data:ICrCourrierInterne)=>{
         if(!this.parentData)  {return;}
         const service = new CrCourrierInterneFactory();
         service.attachAffectation(data.id, this.parentData.relationName+'s', this.parentData.relationId).subscribe();
       }
    )
    return of(true);
 }
}
