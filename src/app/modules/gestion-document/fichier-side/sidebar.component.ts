import { Filter, QueryOptions, Sort } from 'src/app/shared/models/query-options';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ResourceScrollableHelper } from 'src/app/shared/state';
import { ZenFichierUploadService } from '../fichier/fichier-upload.service';
import { IFichier } from 'src/app/core/models/gestion-document/fichier.model';
import { IDossier } from 'src/app/core/models/gestion-document/dossier.model';
import { DossierFactory } from 'src/app/core/services/gestion-document/dossier.factory';
import { FichierFactory } from 'src/app/core/services/gestion-document/fichier.factory';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sidebar',
  templateUrl: 'sidebar.component.html'
})

export class SidebarComponent implements OnInit {
  dossierRecenthelper: ResourceScrollableHelper;
  fichierRecenthelper: ResourceScrollableHelper;
  modalData: IFichier | IDossier;
  @ViewChild('details')
  detailsModal;

  active = 1;
  constructor(
    protected fichierService: ZenFichierUploadService,
    protected modalService: NgbModal
  ) {
   }

  ngOnInit() {
    this.dossierRecenthelper = new ResourceScrollableHelper(new DossierFactory(), new QueryOptions(
      [
          {or: false, filters:[new Filter('isIns', true, 'eq')]},
      ]
    ));
    this.fichierRecenthelper = new ResourceScrollableHelper(new FichierFactory(),new QueryOptions(
      [
          {or: false, filters:[new Filter('isInInsFolder', true, 'eq')]},
      ],
      ['fichier_type','ged_element'],
      8,
      1,
      [new Sort('updated_at','DESC')]
    ));
    this.dossierRecenthelper.pageSize = 20;
    this.fichierRecenthelper.pageSize = 20;
    this.dossierRecenthelper.loadData(1);
    this.fichierRecenthelper.loadData(1);
    this.fichierService.newFichier$.subscribe(
      (data)=> {
        this.fichierRecenthelper.addItem(data);
      }
    )

    this.fichierService.showFolderDetails$.subscribe(
      (data)=> {
        this.onShowDetails(data);
        this.active = 3;
      }
    )
    this.fichierService.showFichierDetails$.subscribe(
      (data)=> {
        this.onShowDetails(data);
        this.active = 3;
      }
    )
  }

  onShowDetails(data: IFichier | IDossier) {
    this.modalData = data;
    this.modalService.open(this.detailsModal, {ariaLabelledBy: 'modal-basic-title', modalDialogClass: 'modal-right modal-right-100vh', }).result.then((result) => {

    }, (reason) => {

    });
  }
}
