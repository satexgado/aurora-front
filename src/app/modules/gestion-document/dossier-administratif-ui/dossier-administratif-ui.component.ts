import { ActivatedRoute,  Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { EditableListComponent } from 'src/app/shared';
import { GedDossierAdministratifEditComponent } from './edit/edit.component';
import { AppTitleService, CacheService } from 'src/app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ResourceScrollableHelper } from 'src/app/shared/state';
import { GedDossierAdministratifFactory } from 'src/app/core/services/gestion-document/ged-dossier-administratif.factory';
import { GedModeleFactory } from 'src/app/core/services/gestion-document/ged-modele.factory';
import { print } from 'src/app/shared/helperfonction';


@Component({
  selector: 'app-ged-dossier-administratif-ui',
  templateUrl: 'dossier-administratif-ui.component.html'
})

export class GedDossierAdministratifUiComponent extends EditableListComponent implements OnInit {

  editModal = GedDossierAdministratifEditComponent;

  constructor(
    protected cacheService: CacheService,
    protected titleservice: AppTitleService,
    protected modalService: NgbModal) { 
      super(new ResourceScrollableHelper(new GedDossierAdministratifFactory()));
    this.titleservice.setTitle('mes Types')
    this.modalService = modalService;
  }

  ngOnInit() {
    this.dataHelper.withoutPaginate = true;
    this.dataHelper.relations = ['structure'];
    super.ngOnInit();
    const service = new GedModeleFactory();

    service.icon().subscribe(print);
  }
}
