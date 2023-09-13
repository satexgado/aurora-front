import { Fichier } from './../../../../core/models/gestion-document/fichier.model';
import { ZenFichierUploadService } from './../fichier-upload.service';
import { Component,  OnInit, EventEmitter, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CacheService } from 'src/app/shared/services';
import { share, tap } from 'rxjs/operators';
import { NotificationService } from 'src/app/shared';
import { Output } from '@angular/core';
import { IFichier } from 'src/app/core/models/gestion-document/fichier.model';
import { FichierFactory } from 'src/app/core/services/gestion-document/fichier.factory';

@Component({
  selector: 'app-store-multiple-file',
  templateUrl: './edit.component.html',
})
export class StoreMultipleFileComponent implements OnInit  {
  @Output() fichierEmitter = new EventEmitter<IFichier>();
  fichierRecent: IFichier[] = [];
  @Input() relation: {
    name: string,
    id: number
  }

  @Input() gedRelation: {
    name: string,
    id: number
  }

  constructor(
    protected fichierService: ZenFichierUploadService,
    protected modalService: NgbModal,
    protected cacheService: CacheService,
    protected notificationService: NotificationService,
    public activeModal: NgbActiveModal)
  {}

  ngOnInit() {
    this.fichierService.newFichier$.subscribe(
      (data)=> {
        this.fichierRecent.unshift(data);
      }
    )
  }

  onAddFile(event) {
    const files: any[] = event.target ? event.target.files: event;
    const service = new FichierFactory();
    for(let i = 0; i<files.length; i++) {
      let newFile = new Fichier();
      newFile.libelle = files[i].name;
      newFile.size = files[i].size;
      let uploadData = {
          libelle: files[i].name,
          fichier: files[i],
      } 
      
      if(this.relation) {
        uploadData['relation_name'] = this.relation.name;
        uploadData['relation_id'] = this.relation.id;
      }

      if(this.gedRelation) {
        uploadData['gedRelation_name'] = this.gedRelation.name;
        uploadData['gedRelation_id'] = this.gedRelation.id;
      }

      newFile.upload$ = service.upload(
        uploadData
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
    }
  }

  fileOver: boolean;
  onSetFileOver(status: boolean) {
    this.fileOver = status;
  }
}
