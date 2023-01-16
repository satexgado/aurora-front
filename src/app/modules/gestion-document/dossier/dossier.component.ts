import { Component, OnInit} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditComponent } from './edit/edit.component';

import { AppTitleService, CacheService } from 'src/app/shared/services';
import { EditableListComponent } from 'src/app/shared';
import { ResourceScrollableHelper } from 'src/app/shared/state';
import { DossierFactory } from 'src/app/core/services/gestion-document/dossier.factory';


@Component({
  selector: 'app-zen-dossier-fichier',
  templateUrl: './dossier.component.html'
})
export class ZenDossierFichierComponent extends EditableListComponent implements OnInit {

  editModal = EditComponent;
  parentData: {relationName: string,relationId: number} = null;

  constructor(
    protected cacheService: CacheService,
    protected titleservice: AppTitleService,
    protected modalService: NgbModal) {
    super(new ResourceScrollableHelper(new DossierFactory()));
    this.titleservice.setTitle('mes types de postes')
    this.modalService = modalService;
  }
}
