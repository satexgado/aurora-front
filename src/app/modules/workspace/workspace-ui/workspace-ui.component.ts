import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Event, NavigationCancel, NavigationEnd, NavigationError, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { IGedWorkspace } from 'src/app/core/models/gestion-document/ged-workspace.model';
import { NotificationService } from 'src/app/shared';
import { Filter } from 'src/app/shared/models/query-options';
import { AppTitleService, CacheService } from 'src/app/shared/services';

@Component({
    selector: 'app-workspace-ged-ui',
    templateUrl: 'workspace-ui.component.html'
})

export class GedWorkspaceUiComponent implements OnInit, OnDestroy {
    subscription: Subscription = new Subscription();
    tabs = 'membres';
    has_child = false; 
    @Input('workspace')  set initWorkspace(workspace: IGedWorkspace) {
        this.workspace = workspace;
    };

    workspace: IGedWorkspace;
    filterTask = [{or: false, filters: [
      new Filter('parent_insc', 1, 'eq'),
    ]}];

    constructor(
        protected cacheService: CacheService,
        protected titleservice: AppTitleService,
        protected notificationService: NotificationService,
        private router: Router,
        private route: ActivatedRoute,
        protected modalService: NgbModal
    ) { }

    ngOnInit() {
      let sub = this.route.data.subscribe((data: { workspace: IGedWorkspace }) =>
      {
        if((!data.workspace))
        {
          this.router.navigate(['/workspace']);
        }
        this.titleservice.setTitle(data.workspace.libelle);
        this.initWorkspace = data.workspace;
      });
      this.subscription.add(sub);

      this.onLoadChild();
      this.subscription.add(
        this.router.events.subscribe((event: Event) => {
          switch (true) {
            case event instanceof NavigationEnd:
            case event instanceof NavigationCancel:
            case event instanceof NavigationError: {
              this.onLoadChild();
              break;
            }
            default: {
              break;
            }
          }
  
        })
      );
  
    }

    onLoadChild() {
      if (this.route.firstChild) {
        return this.has_child = true;
      }
      this.has_child = false;
    }

    ngOnDestroy()
    {
        this.subscription.unsubscribe();
        this.workspace = null;
    }

}