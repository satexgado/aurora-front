import { Fichier } from 'src/app/core/models/gestion-document/fichier.model';
import { ZenFichierUploadService } from './../fichier-upload.service';
import { Component, ChangeDetectorRef, OnInit, EventEmitter, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CacheService } from 'src/app/shared/services';
import { Filter, QueryOptions, Sort } from 'src/app/shared/models/query-options';
import { share, switchMap, tap } from 'rxjs/operators';
import { NotificationService } from 'src/app/shared';
import { Output } from '@angular/core';
import { IFichier } from 'src/app/core/models/gestion-document/fichier.model';
import { FichierFactory } from 'src/app/core/services/gestion-document/fichier.factory';

@Component({
  selector: 'app-basic-store-multiple-file',
  templateUrl: './edit.component.html'
})
export class BasicStoreMultipleFileComponent implements AfterViewInit  {
  fichiers: File[] = [];
  is_loading_dossier = true;
  @Output() fichierEmitter = new EventEmitter<IFichier>();
  @Input() relation_name: string;
  @Input() relation_id: number;
  @ViewChild('filebtn') filebtn: ElementRef;

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
          relation_name: this.relation_name,
          relation_id: this.relation_id
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
}
