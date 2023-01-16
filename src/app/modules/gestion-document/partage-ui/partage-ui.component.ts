import { IFichier } from 'src/app/core/models/gestion-document/fichier.model';
import { ResourceScrollableHelper } from 'src/app/shared/state/resource.scrollable.helper';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Filter, QueryOptions, Sort } from 'src/app/shared/models/query-options';
import { tap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { ZenFichierUploadService } from '../fichier/fichier-upload.service';
import { IDossier } from 'src/app/core/models/gestion-document/dossier.model';
import { FichierFactory } from 'src/app/core/services/gestion-document/fichier.factory';
import { DossierFactory } from 'src/app/core/services/gestion-document/dossier.factory';

@Component({
  selector: 'app-zen-partage-ui',
  templateUrl: 'partage-ui.component.html',
  styleUrls: ['./partage-ui.component.css'],
})

export class ZenPartageUiComponent implements OnInit {
  dossierQueryOption: QueryOptions = new QueryOptions(
    [
      {or: false, filters: [
        new Filter('sharedToUser', true, 'eq'),
        new Filter('cacher', '', 'eq'),
      ]}
    ],
    [
      'inscription', 'ged_element'
    ],
    undefined,
    undefined,
    [new Sort('libelle','ASC')]);

    fichierQueryOption: QueryOptions = new QueryOptions(
      [
        {or: false, filters: [
          new Filter('sharedToUser', true, 'eq'),
          new Filter('cacher', '', 'eq'),
        ]}
      ],
      [
        'fichier_type', 'inscription', 'ged_element'
      ],
      undefined,
      undefined,
      [new Sort('libelle','ASC')])
  fichierShareHelper: ResourceScrollableHelper;
  selectedDossierId: number;
  is_loading_content = true;
  modalData: IDossier;
  modalDataFichiers: IFichier[];
  modalDataDossiers: IDossier[];
  dossier_breadcrumb = [];
  constructor(
    public route: ActivatedRoute,
    public fichierService: ZenFichierUploadService,
  ) { }

  ngOnInit() {}

  onSelectDossier(dossier: IDossier) {
    this.selectedDossierId = dossier ? dossier.id : null;
    if(!this.selectedDossierId) {
      return;
    }
    this.modalData = dossier;
    this.OnInitFolderContent();
  }

  OnInitFolderContent() {
    this.is_loading_content = true;
    const fichierService = new FichierFactory();
    const dossierService = new DossierFactory();
    let observable = [];
    observable.push(
      fichierService.list(
        new QueryOptions(
          [
            {or: false, filters: [
              new Filter('dossier_id', this.modalData.id, 'eq'),
              new Filter('cacher', '', 'eq'),
            ]}
          ],
          [
            'fichier_type', 'inscription','ged_element'
          ],
          undefined,
          undefined,
          [new Sort('libelle','ASC')]
        )
      ).pipe(
        (tap(
          (data)=> {
            this.modalDataFichiers = data.data;
          }
        ))
      )
    );

    observable.push(
      dossierService.list(
        new QueryOptions(
          [
            {or: false, filters: [
              new Filter('dossier_id', this.modalData.id, 'eq'),
              new Filter('cacher', '', 'eq'),
            ]}
          ],
          [
            'inscription','ged_element'
          ],
          undefined,
          undefined,
          [new Sort('libelle','ASC')]
        )
      ).pipe(
        (tap(
          (data)=> {
            this.modalDataDossiers = data.data;
          }
        ))
      )
    )

    forkJoin(observable).subscribe(
      ()=> {
        this.is_loading_content = false;
      }
    );
  }

  onSetBreadCrum(dossier: IDossier) {
    this.dossier_breadcrumb.unshift(dossier);
    if(dossier.dossier) {
      this.onSetBreadCrum(dossier.dossier);
    }
  }

  onUpdateDossier(dossier:IDossier) {
   this.modalDataDossiers = this.modalDataDossiers.map(element => {
      if (element.id === dossier.id ) {
          element = dossier;
      }
      return element;
    });
  }

  onDeleteDossier(dossier:IDossier) {
    const index = this.modalDataDossiers.findIndex(element => element.id === dossier.id);
    this.modalDataDossiers.splice(index, 1);
  }

  onTransfertDossier(transfert: {dossier:IDossier, dossierId:number}) {
    if((this.modalData && this.modalData.id != transfert.dossierId) || (transfert.dossierId&&!this.modalData)) {
      const index = this.modalDataDossiers.findIndex(element => element.id === transfert.dossier.id);
      this.modalDataDossiers.splice(index, 1);
    }
  }

  onUpdateFichier(fichier:IFichier) {
    this.modalDataFichiers = this.modalDataFichiers.map(element => {
      if (element.id === fichier.id ) {
          element = fichier;
      }
      return element;
    });
  }

  onDeleteFichier(fichier:IFichier) {
    const index = this.modalDataFichiers.findIndex(element => element.id === fichier.id);
    this.modalDataFichiers.splice(index, 1);
  }

  onTransfertSingleFichier(transfert: {fichier:IFichier, dossierId:number}) {
    if(this.modalData && this.modalData.id != transfert.dossierId) {
      const index = this.modalDataFichiers.findIndex(element => element.id === transfert.fichier.id);
      this.modalDataFichiers.splice(index, 1);
    }
  }

  onCreateBreadcrumb(dossier: IDossier) {
    this.dossier_breadcrumb = [];
    this.dossier_breadcrumb.unshift(dossier);
  }

  onAddToBreadCrumb(dossier: IDossier) {
    this.dossier_breadcrumb.push(dossier);
  }

  onSliceFromBreadcrumb(index:number){
    this.dossier_breadcrumb.length = index +1;
  }

}
