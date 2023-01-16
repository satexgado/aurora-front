import { ResourceScrollableHelper } from 'src/app/shared/state/resource.scrollable.helper';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CacheService } from 'src/app/shared/services';
import { NotificationService } from 'src/app/shared';
import { QueryOptions } from 'src/app/shared/models/query-options';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ZenFichierUploadService } from '../fichier/fichier-upload.service';
import { ZenFichierBaseComponent } from '../fichier/fichier-base.component';
import { SharedBaseComponent } from '../zen-document-share/shared.base.component';
import { ChangeDetectorRef } from '@angular/core';
import { IDossier } from 'src/app/core/models/gestion-document/dossier.model';
import { DossierFactory } from 'src/app/core/services/gestion-document/dossier.factory';

@Component({
  selector: 'app-zen-dossier-list-ui',
  templateUrl: 'dossier-list-ui.component.html',
  providers: [ZenFichierBaseComponent, SharedBaseComponent]
})

export class ZenDossierListUiComponent {

  dossierHelper: ResourceScrollableHelper;
  @Input('current_dossier') dossier: IDossier;

  @Input('query') set init(query: QueryOptions) {
    this.dossierHelper = new ResourceScrollableHelper(
      new DossierFactory(),
      query
    );
    this.dossierHelper.loadData(1);
  }

  @Input() url = "/document/mon-espace";
  @Input() navigation = true;
  @Output() dossierGotoEmitter = new EventEmitter<IDossier>();

  constructor(
    protected cacheService: CacheService,
    protected notificationService: NotificationService,
    public fichierService: ZenFichierUploadService,
    protected modalService: NgbModal,
    protected cdRef:ChangeDetectorRef

    ) {
  }

  onUpdateDossier(dossier:IDossier) {
    this.dossierHelper.updateItem(dossier);
  }

  onDeleteDossier(dossier:IDossier) {
    this.dossierHelper.removeItem(dossier.id);
  }

  onTransfertDossier(transfert: {dossier:IDossier, dossierId:number}) {
    if((this.dossier && this.dossier.id != transfert.dossierId) || (transfert.dossierId&&!this.dossier)) {
      this.dossierHelper.removeItem(transfert.dossier.id)
    }
  }

}
