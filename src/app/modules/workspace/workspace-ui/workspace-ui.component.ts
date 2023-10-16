import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { IGedWorkspace } from 'src/app/core/models/gestion-document/ged-workspace.model';
import { NotificationService } from 'src/app/shared';
import { AppTitleService, CacheService } from 'src/app/shared/services';

@Component({
    selector: 'app-workspace-ged-ui',
    templateUrl: 'workspace-ui.component.html'
})

export class GedWorkspaceUiComponent implements OnInit, OnDestroy {
    subscription: Subscription = new Subscription();

    @Input('workspace')  set initCoordonnee(workspace: IGedWorkspace) {
        this.workspace = workspace;
    };

    workspace: IGedWorkspace;

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
        this.initCoordonnee = data.workspace;
      });
      this.subscription.add(sub);
    }

    ngOnDestroy()
    {
        this.subscription.unsubscribe();
        this.workspace = null;
    }

}