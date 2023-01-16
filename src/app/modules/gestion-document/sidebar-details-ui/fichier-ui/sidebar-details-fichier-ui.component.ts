import { IFichier } from 'src/app/core/models/gestion-document/fichier.model';
import { map } from 'rxjs/operators';
import { Component, Input, OnInit } from '@angular/core';
import { CacheService } from 'src/app/shared/services';
import { NotificationService } from 'src/app/shared';
import { Observable } from 'rxjs';
import { Filter, QueryOptions } from 'src/app/shared/models/query-options';
import { IGedPartage } from 'src/app/core/models/gestion-document/ged-partage.model';
import { GedPartageFactory } from 'src/app/core/services/gestion-document/ged-partage.model';

@Component({
  selector: 'app-sidebar-details-fichier-ui',
  templateUrl: 'sidebar-details-fichier-ui.component.html'
})

export class SidebarDetailsFichierUiComponent {
  fichier: IFichier;
  share$: Observable<IGedPartage[]>;

  @Input('fichier') set init(fichier: IFichier) {
    this.fichier = fichier;
    if(!fichier) {
      this.fichier = null;
      return ;
    }
    const service = new GedPartageFactory();
    const queryOpt = new QueryOptions([
      {or: false, filters:[new Filter('element', fichier.ged_element.id, 'eq')]},
    ],['personne_inscription']);

    this.share$ = service.list(queryOpt).pipe(
      (map(data=> data.data))
    );
  }

  constructor(
    protected cacheService: CacheService,
    protected notificationService: NotificationService,
  ) {
  }

}
