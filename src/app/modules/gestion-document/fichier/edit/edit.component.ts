import { Fichier } from './../../../../core/models/gestion-document/fichier.model';
import { ZenFichierUploadService } from './../fichier-upload.service';
import { Component, ChangeDetectorRef, OnInit, EventEmitter, ElementRef, ViewChild, AfterViewInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CacheService } from 'src/app/shared/services';
import { Filter, QueryOptions, Sort } from 'src/app/shared/models/query-options';
import { share, switchMap, tap } from 'rxjs/operators';
import { ChooseDossierComponent } from '../../dossier/choose-dossier/choose-dossier.component';
import { NotificationService } from 'src/app/shared';
import { Output } from '@angular/core';
import { IDossier } from 'src/app/core/models/gestion-document/dossier.model';
import { IFichier } from 'src/app/core/models/gestion-document/fichier.model';
import { DossierFactory } from 'src/app/core/services/gestion-document/dossier.factory';
import { FichierFactory } from 'src/app/core/services/gestion-document/fichier.factory';

@Component({
  selector: 'app-store-multiple-file',
  templateUrl: './edit.component.html'
})
export class StoreMultipleFileComponent implements OnInit, AfterViewInit  {
  fichiers: File[] = [];
  dossierId: number = null;
  noDossierSelect = false;
  dossiersRecent: IDossier[];
  allDossiers: IDossier[];
  is_loading_dossier = true;
  @Output() fichierEmitter = new EventEmitter<IFichier>();
  @ViewChild('filebtn') filebtn: ElementRef;
  dossierFilter = [
    {or: false, filters:[new Filter('isIns', true, 'eq')]},
  ];

  chooseDossierFilter = [
    {or: false, filters: [
      new Filter('noParent', true, 'eq'),
    ]}
  ];

  @Input() set settingDossierFilter(filter) {
    this.dossierFilter = filter;
    this.chooseDossierFilter = [...[
      {or: false, filters: [
        new Filter('noParent', true, 'eq'),
      ]}
    ], ... filter];
  }

  constructor(
    protected fichierService: ZenFichierUploadService,
    protected modalService: NgbModal,
    protected cacheService: CacheService,
    protected notificationService: NotificationService,
    public activeModal: NgbActiveModal)
  {}


    ngAfterViewInit(): void {
    this.filebtn.nativeElement.click();
    }

  ngOnInit() {
    this.is_loading_dossier = true;
    const service =  new DossierFactory();
    service.list(new QueryOptions(this.dossierFilter).setSort([new Sort('libelle','ASC')])
    ).pipe(
      switchMap(
        (data)=> {
          this.allDossiers = data.data;
          return service.list(
            new QueryOptions(
              this.dossierFilter,
              [],
              8,
              1,
              [new Sort('updated_at','DESC')]
          )
          );
        }
      )
    ).subscribe(
      (data)=> {
        this.dossiersRecent = data.data;
        this.is_loading_dossier = false;
      }
    );
  }

  onAddFile(event) {
    const files = event.target.files;
    if(!this.fichiers) {
      this.fichiers = [];
    }
    for(let i = 0; i<files.length; i++) {
      this.fichiers.push(files[i]);
    }
  }

  onRemoveFile(i) {
    this.fichiers.splice(i,1);
  }

  doCreateItem(closeModalAfter: boolean = true) {
    const service = new FichierFactory()
    for(let i = 0; i < this.fichiers.length; i++) {
      let newFile = new Fichier();
      newFile.libelle = this.fichiers[i].name;
      newFile.upload$ = service.upload(
        {
          libelle: this.fichiers[i].name,
          fichier: this.fichiers[i],
          relation_name: 'dossiers',
          relation_id: this.dossierId
        }
      ).pipe(
        share()
        ,tap(
          (data)=> {
            // this.notificationService.onSuccess('L\'enregistrement a été effectuer', this.fichiers[i].name);
          }
        )
      );
      this.fichierEmitter.emit(newFile);
      this.fichierService.newFichier.next(newFile);
      // this.fichierService.fichierUpload.push(
      //   {
      //     name: this.fichiers[i].name,
      //     upload: service.upload(
      //     {
      //       libelle: this.fichiers[i].name,
      //       fichier: this.fichiers[i],
      //       relation_name: 'dossiers',
      //       relation_id: this.dossierId
      //     }
      //   ).pipe(
      //     share()
      //   )}
      // )
    }

    this.activeModal.close('tond')
  }

  openDossierModal() {
    const modalRef = this.modalService.open(ChooseDossierComponent, { size: 'lg', centered: true,  backdrop: 'static' });
    const instance = modalRef.componentInstance as ChooseDossierComponent;
    instance.dossierFilter = this.chooseDossierFilter;
    instance.selectedItemEmitter.subscribe(
      (data: IDossier)=> {
        if(!(this.allDossiers.some(item => item.id === data.id)
            || this.dossiersRecent.some(item => item.id === data.id))) {
          this.dossiersRecent.unshift(data);
        }
        this.dossierId = data.id;
      }
    )
  }
}
