import { IFichier } from 'src/app/core/models/gestion-document/fichier.model';
import { Component, Input } from '@angular/core';
import { CacheService } from 'src/app/shared/services';
import { NotificationService } from 'src/app/shared';
import { Filter, QueryOptions, Sort } from 'src/app/shared/models/query-options';
import { tap, map } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';
import { EditComponent as DossierEditComponent} from '../../dossier/edit/edit.component'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IGedPartage } from 'src/app/core/models/gestion-document/ged-partage.model';
import { IDossier } from 'src/app/core/models/gestion-document/dossier.model';
import { GedPartageFactory } from 'src/app/core/services/gestion-document/ged-partage.model';
import { DossierFactory } from 'src/app/core/services/gestion-document/dossier.factory';
import { FichierFactory } from 'src/app/core/services/gestion-document/fichier.factory';
@Component({
  selector: 'app-sidebar-details-dossier-ui',
  templateUrl: 'sidebar-details-dossier-ui.component.html'
})

export class SidebarDetailsDossierUiComponent {

  fichiers: IFichier[];
  dossier_enfant: IDossier[];
  is_loading_content = true;
  dossier: IDossier;
  share$: Observable<IGedPartage[]>;

  @Input('dossier') set init(dossier: IDossier) {
    this.dossier = dossier;
    if(!dossier) {
      this.fichiers = [];
      this.dossier_enfant = [];
      return ;
    }
    const service = new GedPartageFactory();
    const queryOpt = new QueryOptions([
      {or: false, filters:[new Filter('element', dossier.ged_element.id, 'eq')]},
    ],['personne_inscription']);

    this.share$ = service.list(queryOpt).pipe(
      (map(data=> data.data))
    );
    this.is_loading_content = true;
    const fichierService = new FichierFactory();
    const dossierService = new DossierFactory();
    let observable = [];
    observable.push(
      fichierService.list(
        new QueryOptions(
          [
            {or: false, filters: [
              new Filter('dossier_id', dossier.id, 'eq')
            ]}
          ],
          [
            'fichier_type', 'ged_element'
          ],
          undefined,
          undefined,
          [new Sort('libelle','ASC')]
        )
      ).pipe(
        (tap(
          (data)=> {
            this.fichiers = data.data;
          }
        ))
      )
    );

    observable.push(
      dossierService.list(
        new QueryOptions(
          [
            {or: false, filters: [
              new Filter('dossier', dossier.id, 'eq')
            ]}
          ],
          [
            'inscription', 'ged_element'
          ],
          undefined,
          undefined,
          [new Sort('libelle','ASC')]
        )
      ).pipe(
        (tap(
          (data)=> {
            this.dossier_enfant = data.data;
          }
        ))
      )
    )

    // forkJoin(observable).subscribe(
    //   ()=> {
    //     this.is_loading_content = false;
    //   }
    // );
  }

  constructor(
    protected cacheService: CacheService,
    protected notificationService: NotificationService,
    protected modalService: NgbModal
  ) {
  }

  onShowUpdateForm() {
    const modalRef = this.modalService.open(DossierEditComponent, { size: 'lg', centered: true, backdrop: 'static' });
    const instance = modalRef.componentInstance as DossierEditComponent;
    instance.title = `Modifier: ${this.dossier?.libelle}`;
    instance.item = this.dossier;
    instance.isUpdating = true;
    instance.newItem.subscribe(
      (data: IDossier) => {
        this.dossier = data;
      }
    );
  }

}
