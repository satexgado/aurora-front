import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Subscription } from 'rxjs';
import { IBase } from 'src/app/core/models/base.interface';
import { CrTache, CrTacheStatut, ICrTache } from 'src/app/core/models/gestion-courrier/cr-tache';
import { CrTacheList, ICrTacheList } from 'src/app/core/models/gestion-courrier/cr-tache-list';
import { CrTacheFactory } from 'src/app/core/services/gestion-courrier/cr-tache';
import { CrTacheListFactory } from 'src/app/core/services/gestion-courrier/cr-tache-list';
import { Filter, Sort } from 'src/app/shared/models/query-options';
import { QueryOptions, filterGrp } from 'src/app/shared/models/query-options/query-options.model';
import { Edit2Component } from 'src/app/modules/tache/edit2/edit2.component';
@Component({
    selector: 'app-workspace-prodoc',
    templateUrl: 'workspace-prodoc.component.html'
})

export class WorkspaceProdocComponent implements OnInit {
    @Input() parentData: { relationName: string, relationId: number | any[] } = null;
    subscription: Subscription = new Subscription();
    view: 'kanban' | 'list' = localStorage.getItem("prodocViewType") ? <'kanban' | 'list'>localStorage.getItem("prodocViewType") : 'kanban';
    changeIndicator = 0;
    taskListData: { id: number, text: string } = null;
    taskData: { id: number, text: string, parentId: number } = null;
    modalData: ICrTache;
    onChangeView(view: 'kanban' | 'list') {
        this.view = view;
        localStorage.setItem('prodocViewType', view);
    }

    @Input() set init(filters: filterGrp[]) {
        const service = new CrTacheListFactory();
        this.subscription.add(service.list(
            new QueryOptions(
                filters,
                ['cr_taches.responsables','cr_taches.inscription'],
                undefined,
                undefined,
                [new Sort('created_at', 'ASC')]
            )
        ).subscribe(
            (data) => {
                this.is_loading_schema = false;
                this._tache_lists$.next(data.data ?? []);
                this.changeIndicator++;
            }));
    }

    is_loading_schema = true;
    _tache_lists$: BehaviorSubject<ICrTacheList[]> = new BehaviorSubject([]);

    get tache_lists$() {
        return this._tache_lists$.asObservable();
    }

    constructor(
        public router: Router,
        public route: ActivatedRoute,
        protected modalService: NgbModal
    ) { }

    statut_color(statut) {
        switch(statut) {
          case CrTacheStatut.traitement : return 'warning';
          case CrTacheStatut.attente: return 'info';
          case CrTacheStatut.valide: return 'success';
          default: return 'danger';
        }
    }
    ngOnInit() {
        this.route.parent.data.subscribe(
            (res) => {
                let parent = res.data.parent as IBase;
                this.parentData = {
                    relationId: parent.id,
                    relationName: this.route.routeConfig.data['folder_parent']
                };
                this.init = [
                    {
                        or: false, filters: [
                            new Filter(this.route.routeConfig.data['for_search_parent'] ?? this.route.routeConfig.data['folder_parent'], parent.id, 'eq'),
                        ]
                    },
                ];
            }
        )
    }

    open(content, modalData = null) {
        const modalRef = this.modalService.open(content, { size: 'lg', centered: true, backdrop: 'static' });
        this.modalData = modalData;
    }

    updateTaskList(task_list?: ICrTacheList) {
        this.taskListData = {
            id: task_list?.id ?? 0, text: task_list?.libelle ?? ''
        };
    }

    saveTaskListData(oldTaskList?: ICrTacheList) {
        if ((!this.taskListData?.text) || (oldTaskList && oldTaskList.libelle == this.taskListData.text)) {
            this.taskListData = null;
            return;
        }

        const service = new CrTacheListFactory();

        if (this.taskListData.id == 0) {
            this.is_loading_schema = true;
            let task_list = new CrTacheList();
            task_list.libelle = this.taskListData.text;
            let creatVal = { ...task_list };

            if (this.parentData) {
                creatVal = {
                    ...{
                        relation_name: this.parentData.relationName,
                        relation_id: this.parentData.relationId,
                    }, ...task_list
                }
            }
            service.create(creatVal).subscribe(
                (data) => {
                    let tache_lists = this._tache_lists$.value ? this._tache_lists$.value : [];
                    tache_lists.push(data);
                    this._tache_lists$.next(tache_lists);
                    this.changeIndicator++;
                    this.taskListData = null;
                    this.is_loading_schema = false;
                }
            );
        } else {
            oldTaskList.libelle = this.taskListData.text;
            let tache_lists = this._tache_lists$.value ? this._tache_lists$.value : [];
            tache_lists = tache_lists.map(element => {
                if (element.id === this.taskListData.id) {
                    element.libelle = this.taskListData.text;
                }
                return element;
            });
            service.update({ id: this.taskListData.id, libelle: this.taskListData.text }).subscribe(
                (data) => {
                    let tache_lists = this._tache_lists$.value ? this._tache_lists$.value : [];
                    tache_lists = tache_lists.map(element => {
                        if (element.id === this.taskListData.id) {
                            Object.assign(element, data);
                        }
                        return element;
                    });
                    this._tache_lists$.next(tache_lists);
                    this.changeIndicator++;
                    this.taskListData = null;
                }
            );
        }
    }

    updateTask(task_list: ICrTacheList, task?: ICrTache) {
        this.taskData = {
            id: task?.id ?? 0, text: task?.libelle ?? '', parentId: task_list.id
        };
    }

    saveTaskData(oldTask?: ICrTache) {
        if ((!this.taskData?.text) || (oldTask && oldTask.libelle == this.taskData.text)) {
            this.taskData = null;
            return;
        }

        const service = new CrTacheFactory();

        if (this.taskData.id == 0) {
            this.is_loading_schema = true;
            let task = new CrTache();
            task.libelle = this.taskData.text;
            task.tache_list_id = this.taskData.parentId;
            let creatVal = { ...task };

            service.create(creatVal).subscribe(
                (data) => {
                    let tache_lists = this._tache_lists$.value ? this._tache_lists$.value : [];
                    tache_lists = tache_lists.map(element => {
                        if (element.id === this.taskData.parentId) {
                            element.taches.unshift(data);
                        }
                        return element;
                    });
                    this._tache_lists$.next(tache_lists);
                    this.changeIndicator++;
                    this.taskData = null;
                    this.is_loading_schema = false;
                }
            );
        } else {
            oldTask.libelle = this.taskData.text;
            let tache_lists = this._tache_lists$.value ? this._tache_lists$.value : [];
            tache_lists = tache_lists.map(task_list => {
                if (task_list.id === this.taskData.parentId) {
                    task_list.taches.map(element => {
                        if (element.id === this.taskData.id) {
                            element.libelle = this.taskData.text;
                        }
                        return element;
                    })
                }
                return task_list;
            });
            service.update({ id: this.taskData.id, libelle: this.taskData.text }).subscribe(
                (data) => {
                    let tache_lists = this._tache_lists$.value ? this._tache_lists$.value : [];
                    tache_lists = tache_lists.map(task_list => {
                        if (task_list.id === this.taskData.parentId) {
                            task_list.taches.map(element => {
                                if (element.id === this.taskData.id) {
                                    Object.assign(element, data);
                                }
                                return element;
                            })
                        }
                        return task_list;
                    });
                    this._tache_lists$.next(tache_lists);
                    this.changeIndicator++;
                    this.taskData = null;
                }
            );
        }
    }

    onShowCreateTacheForm() {
        const modalRef = this.modalService.open(Edit2Component, { size: 'lg', centered: true, backdrop: 'static' });
        const instance = modalRef.componentInstance as Edit2Component;
        instance.title = `Creer:`;

        if (this.parentData && this.parentData.relationId) {
            Object.values(this.parentData.relationId)
                .forEach(val => {
                    instance.userFilter = [
                        { or: false, filters: [new Filter('workspacesId', val.workspace, 'eq')] },
                    ]
                });
        }

        instance.newItem.subscribe(
            (data) => {
                data.statut = 'En attente';
                // const taches = this._taches$.value ? this._taches$.value : [] ;
                // taches.unshift(data);
                // this._taches$.next(taches);
                this.changeIndicator++;
            }
        );
    }

    onShowUpdateTacheForm(item: CrTache) {
        console.log(item);
        const modalRef = this.modalService.open(Edit2Component, { size: 'lg', centered: true, backdrop: 'static' });
        const instance = modalRef.componentInstance as Edit2Component;
        instance.title = `Modifier: ${item.libelle}`;
        instance.item = item;
        instance.isUpdating = true;
        if (this.parentData && this.parentData.relationId) {
            Object.values(this.parentData.relationId)
                .forEach(val => {
                    instance.userFilter = [
                        { or: false, filters: [new Filter('workspacesId', val.workspace, 'eq')] },
                    ]
                });
        }
        if (this.parentData && this.parentData.relationId) {
            Object.values(this.parentData.relationId)
                .forEach(val => {
                    instance.userFilter = [
                        { or: false, filters: [new Filter('workspacesId', val.workspace, 'eq')] },
                    ]
                });
        }
        modalRef.componentInstance.newItem.subscribe(
            (data: ICrTache) => {
                console.log(data);
                let tache_lists = this._tache_lists$.value ? this._tache_lists$.value : [];
                tache_lists = tache_lists.map(task_list => {
                    if (task_list.id === item.tache_list_id) {
                        task_list.taches.map(element => {
                            if (element.id === data.id) {
                                Object.assign(element, data);
                            }
                            return element;
                        })
                    }
                    return task_list;
                });
                this._tache_lists$.next(tache_lists);
                this.changeIndicator++;
            }
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}