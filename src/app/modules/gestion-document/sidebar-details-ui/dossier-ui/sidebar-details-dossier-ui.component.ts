import { Component, Input } from '@angular/core';
import { CacheService } from 'src/app/shared/services';
import { NotificationService } from 'src/app/shared';
import { Observable } from 'rxjs';
import { EditComponent as DossierEditComponent} from '../../dossier/edit/edit.component'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IGedPartage } from 'src/app/core/models/gestion-document/ged-partage.model';
import { IDossier } from 'src/app/core/models/gestion-document/dossier.model';
@Component({
  selector: 'app-sidebar-details-dossier-ui',
  templateUrl: 'sidebar-details-dossier-ui.component.html'
})

export class SidebarDetailsDossierUiComponent {

  is_loading_content = true;
  dossier: IDossier;
  share$: Observable<IGedPartage[]>;

  @Input('dossier') set init(dossier: IDossier) {
    this.dossier = dossier;
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
