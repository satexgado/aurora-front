import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WorkspaceUiService } from '../workspace.service';
import { IGedWorkspaceCoordonnee } from 'src/app/core/models/gestion-document/ged-workspace-coordonnee.model';
import { Filter } from 'src/app/shared/models/query-options';
import { ICrCoordonnee } from 'src/app/core/models/gestion-courrier/cr-coordonnee';

@Component({
  selector: 'app-workspace-details-ui',
  templateUrl: 'workspace-details-ui.component.html'
})

export class GedWorkspaceDetailsUiComponent implements OnInit {
  selectedCoordonnee: ICrCoordonnee;
  subscription: Subscription = new Subscription();

  filterTask = [{
    or: false, filters: [
      new Filter('parent_insc', 1, 'eq'),
    ]
  }];

  constructor(protected uiService: WorkspaceUiService) { }

  ngOnInit() {
    this.subscription.add(
      this.uiService.coordonneeData$.subscribe(
        (coordonnee) => {
          this.selectedCoordonnee = coordonnee;
        }
      )
    )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}