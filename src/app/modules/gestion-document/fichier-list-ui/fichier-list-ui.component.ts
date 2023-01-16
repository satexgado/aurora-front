import { ResourceScrollableHelper } from 'src/app/shared/state/resource.scrollable.helper';
import { Component, Input } from '@angular/core';
import { CacheService } from 'src/app/shared/services';
import { NotificationService } from 'src/app/shared';
import { QueryOptions } from 'src/app/shared/models/query-options';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ZenFichierUploadService } from '../fichier/fichier-upload.service';
import { ZenFichierBaseComponent } from '../fichier/fichier-base.component';
import { SharedBaseComponent } from '../zen-document-share/shared.base.component';
import { ChangeDetectorRef } from '@angular/core';
import { IDossier } from 'src/app/core/models/gestion-document/dossier.model';
import { FichierFactory } from 'src/app/core/services/gestion-document/fichier.factory';
import { IFichier } from 'src/app/core/models/gestion-document/fichier.model';

@Component({
  selector: 'app-zen-fichier-list-ui',
  templateUrl: 'fichier-list-ui.component.html',
  providers: [ZenFichierBaseComponent, SharedBaseComponent]
})

export class ZenFichierListUiComponent {

  fichierHelper: ResourceScrollableHelper;
  @Input('current_dossier') dossier: IDossier;

  @Input('query') set init(query: QueryOptions) {
    this.fichierHelper = new ResourceScrollableHelper(
      new FichierFactory(),
      query
    );
    this.fichierHelper.loadData(1);
  }

  constructor(
    protected cacheService: CacheService,
    protected notificationService: NotificationService,
    public fichierService: ZenFichierUploadService,
    protected modalService: NgbModal,
    protected cdRef:ChangeDetectorRef
    ) {
  }

  onUpdateFichier(fichier:IFichier) {
    this.fichierHelper.updateItem(fichier);
  }

  onDeleteDossier(fichier:IFichier) {
    this.fichierHelper.removeItem(fichier.id);
  }

  onTransfertDossier(transfert: {fichier:IFichier, dossierId:number}) {
    if((this.dossier && this.dossier.id != transfert.dossierId) || (transfert.dossierId&&!this.dossier)) {
      this.fichierHelper.removeItem(transfert.fichier.id)
    }
  }

}
