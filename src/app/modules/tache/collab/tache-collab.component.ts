import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser, User } from 'src/app/core/models/user';
import { UserFactory } from 'src/app/core/services/user.factory';
import { Filter } from 'src/app/shared/models/query-options';
import { ResourceScrollableHelper } from 'src/app/shared/state';

@Component({
    selector: 'app-tache-collaboration',
    templateUrl: 'tache-collab.component.html',
    styleUrls: ['./tache-collab.component.scss']
})

export class TacheCollabComponent implements OnInit {

    userHelper: ResourceScrollableHelper;
    data$: Observable<User>;
    selectedUser: User = null;
    constructor() { }

    ngOnInit() { 
        this.userHelper = new ResourceScrollableHelper(new UserFactory());
        this.userHelper.sortColumn = 'nom_complet';
        // this.userHelper.sortDirection = 'Asc';
        this.userHelper.relations = [
            'cr_taches.responsables', 'cr_taches.structures', 'cr_taches.inscription', 'cr_taches.courriers'
        ];
        
        this.userHelper.query = [
            {or: false, filters:[new Filter('has_tache_collab', 1, 'eq')]}
        ];

        this.userHelper.loadData();
    }

    onSetSelected(selectedUser: IUser) {
        this.selectedUser = selectedUser;
    }
}