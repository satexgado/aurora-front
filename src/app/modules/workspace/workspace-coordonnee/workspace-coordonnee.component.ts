import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CoordonneeChooseMultiItem2Component } from '../../choose-item/coordonnee-choose/coordonnee-choose-multi-item2.component';
import { ResourceScrollableHelper } from 'src/app/shared/state';
import { Filter, QueryOptions, Sort } from 'src/app/shared/models/query-options';
import { GedWorkspaceCoordonneeFactory } from 'src/app/core/services/gestion-document/ged-workspace-coordonnee.factory';
import { GedWorkspaceGroupe, IGedWorkspaceGroupe } from 'src/app/core/models/gestion-document/ged-workspace-groupe.model';
import { GedWorkspaceGroupeFactory } from 'src/app/core/services/gestion-document/ged-workspace-groupe.factory';
import { IGedWorkspace } from 'src/app/core/models/gestion-document/ged-workspace.model';
import { IGedWorkspaceCoordonnee } from 'src/app/core/models/gestion-document/ged-workspace-coordonnee.model';
import { take } from 'rxjs/operators';
import { ICrCoordonnee } from 'src/app/core/models/gestion-courrier/cr-coordonnee';

@Component({
    selector: 'app-workspace-coordonnee',
    templateUrl: 'workspace-coordonnee.component.html'
})

export class WorkspaceCoordonneeComponent implements OnInit {
    
    workspaceCoordonneeHelper: ResourceScrollableHelper;
    groupelist: GedWorkspaceGroupe[] = [];
    workspace:IGedWorkspace; 
    updatingGroupeId = null;
    modalData: ICrCoordonnee;
    modalCalendarQuery: QueryOptions;
    @Input() view: 'card'|'list' = 'list';

    @Input() set init(workspace: IGedWorkspace) {
        this.workspace = workspace;
        if(!workspace) {
            return;
        }
        this.workspaceCoordonneeHelper = new ResourceScrollableHelper(
            new GedWorkspaceCoordonneeFactory(),
            new QueryOptions().setFilterGroups(
                [
                  {or: true, filters:[new Filter('workspace_id', workspace.id, 'eq')]},
                ]
            ).setIncludes(['cr_coordonnee.cr_coordonnee_groupes'])
        );
        this.workspaceCoordonneeHelper.withoutPaginate = true;
        this.workspaceCoordonneeHelper.loadData();
        const service = new GedWorkspaceGroupeFactory();        
        service.list(
            new QueryOptions().setFilterGroups(
                [
                  {or: true, filters:[new Filter('workspace_id', workspace.id, 'eq')]},
                  {or: true, filters:[new Filter('type', 'coordonnee', 'eq')]},
                ]
              )
        ).subscribe(
            (data)=>{
               this.groupelist = data.data; 
            }
        );
    }
    constructor(
        protected modalService: NgbModal
    ) { }


    ngOnInit() { 
        // fetch('https://api.ipregistry.co/?key=tryout')
        // .then(function (response) {
        //     return response.json();
        // })
        // .then(function (payload) {
        //     console.log(payload.location.country.name + ', ' + payload.location.city);
        // });
    }

    onChooseMembre(preselected:IGedWorkspaceCoordonnee[],  item?: IGedWorkspaceGroupe)
    {
        const modalRef = this.modalService.open(CoordonneeChooseMultiItem2Component,{ size: 'lg', centered: true,  backdrop: 'static' });
        const instance = modalRef.componentInstance as CoordonneeChooseMultiItem2Component;
        instance.preselected = preselected.map((element:IGedWorkspaceCoordonnee)=>element.coordonnee);
        instance.multipleItemChoosen.subscribe(
            (data)=>{
                let ids = data.map(element=>element.id);
                const removedCoordonnees = preselected.filter(
                (element:IGedWorkspaceCoordonnee)=> !ids.includes(element.coordonnee_id))
                .map(
                    (element:IGedWorkspaceCoordonnee)=>element.id
                );
                const coordonnees = data.map(
                    (element:ICrCoordonnee)=>{
                        let mapped = {
                            coordonnee_id: element.id,
                            workspace_id: this.workspace.id,
                        }   
                        if(item){
                            mapped['groupe_id']= item.id
                        }
                        return mapped;
                    }
                );
                let service = new GedWorkspaceCoordonneeFactory();
                service.createmulti(
                    {coordonnees:coordonnees, removedCoordonnees:removedCoordonnees}
                ).subscribe(
                    (newdata)=> {
                    this.workspaceCoordonneeHelper.clearData();
                    this.workspaceCoordonneeHelper.loadData();
                    }
                );
            }
        )
    }

    quickAdd(item?:IGedWorkspace) {
        if(item) {
            this.updatingGroupeId = item.id;
        } else {
            let workspaceGroupe = new GedWorkspaceGroupe();
            workspaceGroupe.id = null;
            workspaceGroupe.workspace_id = this.workspace.id;
            workspaceGroupe.type = 'coordonnee';
            this.groupelist.unshift(workspaceGroupe);
            this.updatingGroupeId = null;
        }    
    }

    quickConsole(item:IGedWorkspaceGroupe) {
        this.updatingGroupeId = 0;
        if(!item.libelle) {
            if(item.id) {
                this.removeItem(item);
            } else {
                this.groupelist.splice(0,1);
            }
            return;
        }
        const service = new GedWorkspaceGroupeFactory();
        if(item.id) {
            service.update(item).subscribe(
                data=>{
                    Object.assign(item, data);
                }
            )
        } else {
            service.create(item).subscribe(
                (data)=>{
                    Object.assign(item, data);
                }
              )
        }
        
      }

    removeItem(item: GedWorkspaceGroupe) {
        const index = this.groupelist.findIndex(element => element.id === item.id);
        this.groupelist.splice(index, 1);
        if(item.id) {
            const service = new GedWorkspaceGroupeFactory();
            service.delete(item.id).subscribe();
        }
    }

    open(content, coordonnee: ICrCoordonnee) {
        this.modalCalendarQuery = new QueryOptions(
          [
            // {or: false, filters:[new Filter('coordonnee_id', coordonnee.id, 'eq')]},
          ],
          ['cal_type_calendrier', 'participants']
        );
        this.modalData = coordonnee;
        this.modalService.open(content,  { size: 'lg', centered: true,  backdrop: 'static' });
    }
}