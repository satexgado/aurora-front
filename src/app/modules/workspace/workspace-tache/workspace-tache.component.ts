import { Component, OnInit } from '@angular/core';
import { IBase } from 'src/app/core/models/base.interface';
import { GestionnaireTacheComponent } from 'src/app/modules/tache/tache.component';
import { Filter } from 'src/app/shared/models/query-options';

@Component({
    selector: 'app-workspace-tache',
    templateUrl: 'workspace-tache.component.html',
    styleUrls: ['./workspace-tache.component.css']
})

export class WorkspaceTacheComponent extends GestionnaireTacheComponent implements OnInit {

    ngOnInit() {
        super.ngOnInit();
        this.route.parent.data.subscribe(
            (res)=> {
              let parent = res.data.parent as IBase;
              this.parentData = {
                relationId: parent.id,
                relationName: this.route.routeConfig.data['folder_parent']
              };
              this.init = [
                {or: false, filters:[
                  new Filter(this.route.routeConfig.data['for_search_parent']??this.route.routeConfig.data['folder_parent'], parent.id, 'eq'),
                ]},
              ];
            }
          )
    }
}