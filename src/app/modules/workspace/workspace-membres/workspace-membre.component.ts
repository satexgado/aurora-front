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
import {
    trigger,
    state,
    style,
    animate,
    transition
} from '@angular/animations';
import { ExpressCourrierService } from 'src/app/express-courrier/express-courrier.service';


@Component({
    selector: 'app-workspace-membre',
    templateUrl: 'workspace-membre.component.html',
    styles: [`
        .card {
            margin-bottom: 24px;
            box-shadow: 0 2px 3px #e4e8f0;
        }
        .card {
            position: relative;
            display: flex;
            flex-direction: column;
            min-width: 0;
            word-wrap: break-word;
            background-color: #fff;
            background-clip: border-box;
            border: 1px solid #eff0f2;
        }
        .avatar-md {
            height: 4rem;
            width: 4rem;
        }
        .rounded-circle {
            border-radius: 50%!important;
        }
        .img-thumbnail {
            padding: 0.25rem;
            background-color: #f1f3f7;
            border: 1px solid #eff0f2;
            border-radius: 0.75rem;
        }
        .avatar-title {
            align-items: center;
            background-color: #3b76e1;
            color: #fff;
            display: flex;
            font-weight: 500;
            height: 100%;
            justify-content: center;
            width: 100%;
        }
        .bg-soft-primary {
            background-color: rgba(59,118,225,.25)!important;
        }
        a {
            text-decoration: none!important;
        }
        .badge-soft-danger {
            color: #f56e6e !important;
            background-color: rgba(245,110,110,.1);
        }
        .badge-soft-success {
            color: #63ad6f !important;
            background-color: rgba(99,173,111,.1);
        }
        .mb-0 {
            margin-bottom: 0!important;
        }
        .badge {
            display: inline-block;
            padding: 0.25em 0.6em;
            font-size: 75%;
            font-weight: 500;
            line-height: 1;
            color: #fff;
            text-align: center;
            white-space: nowrap;
            vertical-align: baseline;
            border-radius: 0.75rem;
        }

        .image_outer_container{
            margin-top: auto;
            margin-bottom: auto;
            border-radius: 50%;
            position: relative;
        }

        .image_inner_container{
            border-radius: 50%;
            padding: 5px;
            background-color: #f2cf07;
            background-image: linear-gradient(315deg, #f2cf07 0%, #55d284 74%);
        }


        .offline .image_inner_container {
        background-color: #f9fcff;
        background-image: linear-gradient(147deg, #f9fcff 0%, #dee4ea 74%);
        }

        .away .image_inner_container {
        background-color: #ff4e00;
        background-image: linear-gradient(315deg, #ff4e00 0%, #ec9f05 74%);
        }

        .image_inner_container img{
            height: 64px;
            width: 64px;
            border-radius: 50%;
            border: 5px solid white;
        }

        .image_outer_container .icon_statut{
        background-color: #4cd137;
        position: absolute;
        right: 0px;
        bottom: 5px;
        height: 20px;
        width: 20px;
        border:5px solid white;
        border-radius: 50%;
        }

        .online .icon_statut {
            background-color: #28a745!important;
        }

        .offline .icon_statut {
            background-color: #dc3545!important;
        }

        .away .icon_statut {
            background-color: #ffc107!important;
        }
  `],
    animations: [
        trigger('flyInOut', [
            state('in', style({ transform: 'translateX(0)' })),
            transition('void => *', [
                style({ transform: 'translateX(-100%)' }),
                animate(100)
            ]),
            transition('* => void', [
                animate(100, style({ transform: 'translateX(100%)' }))
            ])
        ])
    ]
})

export class WorkspaceMembreComponent implements OnInit {

    workspaceUserHelper: ResourceScrollableHelper;
    groupelist: GedWorkspaceGroupe[] = [];
    workspace: IGedWorkspace;
    updatingGroupeId = null;
    @Input() view: 'card' | 'list' = 'list';

    @Input() set init(workspace: IGedWorkspace) {
        this.workspace = workspace;
        if (!workspace) {
            return;
        }
        this.workspaceUserHelper = new ResourceScrollableHelper(
            new GedWorkspaceUserFactory(),
            new QueryOptions().setFilterGroups(
                [
                    { or: true, filters: [new Filter('workspace_id', workspace.id, 'eq')] },
                ]
            ).setIncludes(['personne_inscription'])
        );
        this.workspaceUserHelper.withoutPaginate = true;
        this.workspaceUserHelper.loadData();
        const service = new GedWorkspaceGroupeFactory();
        service.list(
            new QueryOptions().setFilterGroups(
                [
                    { or: true, filters: [new Filter('workspace_id', workspace.id, 'eq')] },
                    { or: true, filters: [new Filter('type', 'user', 'eq')] },
                ]
            )
        ).subscribe(
            (data) => {
                this.groupelist = data.data;
            }
        );
    }
    constructor(
        protected modalService: NgbModal,
        public expressService: ExpressCourrierService,

    ) { }


    ngOnInit() {
        // fetch('https://api.ipregistry.co/?key=tryout')
        // .then(function (response) {
        //     return response.json();
        // })
        // .then(function (payload) {
        //     console.log(payload.location.country.name + ', ' + payload.location.city);
        // });

        this.expressService.onlineUsers$.subscribe(
            (data) => {
                data.forEach(
                    (user) => {
                        let item = this.workspaceUserHelper.findItemByColumn(user.id, 'personne_id') as IGedWorkspaceUser;
                        if (item && item.personne) {
                            item.personne.last_activity_at = user.last_activity_at;
                            this.workspaceUserHelper.updateItem(item);
                        }
                    }
                )

            }
        )
    }

    onChooseMembre(preselected: IGedWorkspaceUser[], item?: IGedWorkspaceGroupe) {
        const modalRef = this.modalService.open(UserChooseMultiItem2Component, { size: 'lg', centered: true, backdrop: 'static' });
        const instance = modalRef.componentInstance as UserChooseMultiItem2Component;
        instance.preselected = preselected.map((element: IGedWorkspaceUser) => element.personne);
        instance.multipleItemChoosen.subscribe(
            (data) => {
                let ids = data.map(element => element.id);
                const removedUsers = preselected.filter(
                    (element: IGedWorkspaceUser) => !ids.includes(element.personne_id))
                    .map(
                        (element: IGedWorkspaceUser) => element.id
                    );
                const users = data.map(
                    (element: IUser) => {
                        let mapped = {
                            personne_id: element.id,
                            workspace_id: this.workspace.id,
                        }
                        if (item) {
                            mapped['groupe_id'] = item.id
                        }
                        return mapped;
                    }
                );
                let service = new GedWorkspaceUserFactory();
                service.createmulti(
                    { users: users, removedUsers: removedUsers }
                ).subscribe(
                    (newdata) => {
                        this.workspaceUserHelper.clearData();
                        this.workspaceUserHelper.loadData();
                    }
                );
            }
        )
    }

    quickAdd(item?: IGedWorkspace) {
        if (item) {
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

    quickConsole(item: IGedWorkspaceGroupe) {
        this.updatingGroupeId = 0;
        if (!item.libelle) {
            if (item.id) {
                this.removeItem(item);
            } else {
                this.groupelist.splice(0, 1);
            }
            return;
        }
        const service = new GedWorkspaceGroupeFactory();
        if (item.id) {
            service.update(item).subscribe(
                data => {
                    Object.assign(item, data);
                }
            )
        } else {
            service.create(item).subscribe(
                (data) => {
                    Object.assign(item, data);
                }
            )
        }

    }

    removeItem(item: GedWorkspaceGroupe) {
        const index = this.groupelist.findIndex(element => element.id === item.id);
        this.groupelist.splice(index, 1);
        if (item.id) {
            const service = new GedWorkspaceGroupeFactory();
            service.delete(item.id).subscribe();
        }
    }
}