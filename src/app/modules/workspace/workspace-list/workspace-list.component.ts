import { Component, OnInit} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditComponent } from './edit/edit.component';

import { AppTitleService, CacheService } from 'src/app/shared/services';
import { EditableListComponent } from 'src/app/shared';
import { ResourceScrollableHelper } from 'src/app/shared/state';
import { QueryOptions, Filter, Sort } from 'src/app/shared/models/query-options';
import { of } from 'rxjs';
import { IGedWorkspace } from 'src/app/core/models/gestion-document/ged-workspace.model';
import { GedWorkspaceFactory } from 'src/app/core/services/gestion-document/ged-workspace.factory';

@Component({
  selector: 'app-workspace-list',
  templateUrl: './workspace-list.component.html'
})
export class WorkspaceListComponent extends EditableListComponent implements OnInit {

  editModal = EditComponent;
  modalData: IGedWorkspace;
  parentData: {relationName: string,relationId: number} = null;

  constructor(
    protected cacheService: CacheService,
    protected titleservice: AppTitleService,
    protected modalService: NgbModal) {
    super(new ResourceScrollableHelper(new GedWorkspaceFactory()));
    this.titleservice.setTitle('mes Workspaces')
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
        this.dataHelper.relations = ['structure'];
        this.parentData = data;
        this.dataHelper = new ResourceScrollableHelper(new GedWorkspaceFactory(), queryOptions);
        super.ngOnInit()
      },
      ()=>{
        super.ngOnInit();
        this.dataHelper.relations = ['structure'];
        this.dataHelper.sortColumn = 'libelle';
        this.dataHelper.sortDirection = 'Asc';
      }
    )
  }

  onShowCreateForm(item?, modal = this.editModal) {
    super.onShowCreateForm(item).subscribe(
       (data:IGedWorkspace)=>{
         if(!this.parentData)  {return;}
         const service = new GedWorkspaceFactory();
         service.attachAffectation(data.id, this.parentData.relationName+'s', this.parentData.relationId).subscribe();
       }
    )
    return of(true);
 }

 openModal(content, data: IGedWorkspace) {
  this.modalData = data;
  this.modalService.open(content, { size: 'lg', centered: true,  backdrop: 'static' });
}

  onSwitchStatut(){

  }

}
