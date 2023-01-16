import { ResourceScrollableHelper } from 'src/app/shared/state/resource.scrollable.helper';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Filter, QueryOptions, Sort } from 'src/app/shared/models/query-options';
import { StoreMultipleFileComponent } from '../fichier/edit/edit.component';
import { DossierFactory } from 'src/app/core/services/gestion-document/dossier.factory';
import { FichierFactory } from 'src/app/core/services/gestion-document/fichier.factory';

@Component({
  selector: 'app-zen-document-home',
  templateUrl: 'home.component.html'
})

export class ZenDocumentHomeComponent implements OnInit {
  dossierRecenthelper: ResourceScrollableHelper;
  fichierRecenthelper: ResourceScrollableHelper;
  dossierFilter = [
    {or: false, filters:[
      new Filter('isIns', true, 'eq'),
      new Filter('noParent', true, 'eq'),
    ]},
  ];

  constructor(
    protected modalService: NgbModal
  ) { }

  ngOnInit() {
    this.dossierRecenthelper = new ResourceScrollableHelper(new DossierFactory());
    this.fichierRecenthelper = new ResourceScrollableHelper(new FichierFactory(),new QueryOptions(
      [
          {or: false, filters:[new Filter('isInInsFolder', true, 'eq')]},
      ],
      [],
      8,
      1,
      [new Sort('updated_at','DESC')]
    ));
    this.dossierRecenthelper.pageSize = 4;
    this.fichierRecenthelper.pageSize = 6;
    this.dossierRecenthelper.loadData(1);
    this.fichierRecenthelper.loadData(1);
  }

  openModal(content) {
    this.modalService.open(content, { size: 'lg', centered: true,  backdrop: 'static' });
  }

  openFileModal() {
    this.modalService.open(StoreMultipleFileComponent, { size: 'lg', centered: true,  backdrop: 'static' });
  }
}
