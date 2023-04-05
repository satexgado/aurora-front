import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ICrTache } from 'src/app/core/models/gestion-courrier/cr-tache';
import { IUser, User } from 'src/app/core/models/user';
import { UserFactory } from 'src/app/core/services/user.factory';
import { ExpressCourrierService } from 'src/app/express-courrier/express-courrier.service';
import { Filter } from 'src/app/shared/models/query-options';
import { ResourceScrollableHelper } from 'src/app/shared/state';
import { GestionnaireTacheComponent } from '../tache.component';

@Component({
    selector: 'app-tache-collaboration',
    templateUrl: 'tache-collab.component.html',
    styleUrls: ['./tache-collab.component.scss']
})

export class TacheCollabComponent implements OnInit, OnDestroy {

    @ViewChild(GestionnaireTacheComponent) gestionTache;

    userHelper: ResourceScrollableHelper;
    data$: Observable<User>;
    selectedUser: IUser = null;
    subscription: Subscription = new Subscription();
    view = localStorage.getItem("tacheCollabViewType") ? localStorage.getItem("tacheCollabViewType"):  'card-columns';
    constructor(
        public expressService: ExpressCourrierService,
    ) { }

    ngOnInit() { 
        this.userHelper = new ResourceScrollableHelper(new UserFactory());
        this.userHelper.sortColumn = 'nom_complet';

        this.userHelper.relations = [
            'tache_linkeds.responsables', 'tache_linkeds.structures', 'tache_linkeds.inscription', 'tache_linkeds.courriers'
        ];
        
        this.userHelper.query = [
            {or: false, filters:[new Filter('has_tache_collab', 1, 'eq')]}
        ];

        this.userHelper.loadData();

        this.subscription.add(
        this.expressService.onlineUsers$.subscribe(
            (data)=> {
              data.forEach(
                (user)=> {
                  let item = this.userHelper.findItemByColumn(user.id) as IUser;
                  if(item) {
                    item.last_activity_at = user.last_activity_at;
                    this.userHelper.updateItem(item);
                  }
                }
              )
            }
        ));
    }

    onSetSelected(selectedUser: IUser) {
        this.selectedUser = selectedUser;
        
    }

    onChangeView(view) {
        this.view = view;
        localStorage.setItem('tacheCollabViewType',view);
    }

    onClearComment() {
        if(this.gestionTache) {
            this.gestionTache.onShowComment();
        }
    }

    onSetTache(tache: ICrTache) {
        if(this.gestionTache) {
            this.gestionTache.onShowComment(tache);
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}