import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserChooseMultiItem2Component } from '../../choose-item/user-choose/user-choose-multi-item2.component';
import { ResourceScrollableHelper } from 'src/app/shared/state';
import { Filter, QueryOptions, Sort } from 'src/app/shared/models/query-options';
import { GedWorkspaceUserFactory } from 'src/app/core/services/gestion-document/ged-workspace-user.factory';
import { GedWorkspaceGroupe, IGedWorkspaceGroupe } from 'src/app/core/models/gestion-document/ged-workspace-groupe.model';
import { GedWorkspaceGroupeFactory } from 'src/app/core/services/gestion-document/ged-workspace-groupe.factory';
import { IGedWorkspace } from 'src/app/core/models/gestion-document/ged-workspace.model';
import { IGedWorkspaceUser } from 'src/app/core/models/gestion-document/ged-workspace-user.model';
import { IUser } from 'src/app/core/models/user';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-workspace-membre',
    templateUrl: 'workspace-membre.component.html'
})

export class WorkspaceMembreComponent implements OnInit {
    
    workspaceUserHelper: ResourceScrollableHelper;
    groupelist: GedWorkspaceGroupe[] = [];
    workspace:IGedWorkspace; 
    updatingGroupeId = null;
    @Input() view: 'card'|'list' = 'list';

    @Input() set init(workspace: IGedWorkspace) {
        this.workspace = workspace;
        if(!workspace) {
            return;
        }
        this.workspaceUserHelper = new ResourceScrollableHelper(
            new GedWorkspaceUserFactory(),
            new QueryOptions().setFilterGroups(
                [
                  {or: true, filters:[new Filter('workspace_id', workspace.id, 'eq')]},
                ]
            ).setIncludes(['personne_inscription'])
        );
        this.workspaceUserHelper.withoutPaginate = true;
        this.workspaceUserHelper.loadData();
        const service = new GedWorkspaceGroupeFactory();        
        service.list(
            new QueryOptions().setFilterGroups(
                [
                  {or: true, filters:[new Filter('workspace_id', workspace.id, 'eq')]},
                  {or: true, filters:[new Filter('type', 'user', 'eq')]},
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

    onChooseMembre(preselected:IGedWorkspaceUser[],  item?: IGedWorkspaceGroupe)
    {
        const modalRef = this.modalService.open(UserChooseMultiItem2Component,{ size: 'lg', centered: true,  backdrop: 'static' });
        const instance = modalRef.componentInstance as UserChooseMultiItem2Component;
        instance.preselected = preselected.map((element:IGedWorkspaceUser)=>element.personne);
        instance.multipleItemChoosen.subscribe(
            (data)=>{
                let ids = data.map(element=>element.id);
                const removedUsers = preselected.filter(
                (element:IGedWorkspaceUser)=> !ids.includes(element.personne_id))
                .map(
                    (element:IGedWorkspaceUser)=>element.id
                );
                const users = data.map(
                    (element:IUser)=>{
                        let mapped = {
                            personne_id: element.id,
                            workspace_id: this.workspace.id,
                        }   
                        if(item){
                            mapped['groupe_id']= item.id
                        }
                        return mapped;
                    }
                );
                let service = new GedWorkspaceUserFactory();
                service.createmulti(
                    {users:users, removedUsers:removedUsers}
                ).subscribe(
                    (newdata)=> {
                    this.workspaceUserHelper.clearData();
                    this.workspaceUserHelper.loadData();
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
            workspaceGroupe.type = 'user';
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
}