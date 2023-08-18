import { Observable } from 'rxjs';
import { Upload } from 'src/app/shared';
import { Injectable, OnChanges, SimpleChanges } from '@angular/core';
import findLastIndex from "lodash/findLastIndex";
import { Subject } from 'rxjs';
import { IDossier } from 'src/app/core/models/gestion-document/dossier.model';
import { IFichier } from 'src/app/core/models/gestion-document/fichier.model';

@Injectable({
    providedIn: 'root'
})
export class ZenFichierUploadService  {

  is_uploading_file
  fichierUpload: {
   upload: Observable<Upload>,
   name: string
  }[] = [];

  fichierDownload: {
    upload: Observable<Upload>,
    name: string
  }[] = [];

  showFolderDetails = new Subject<IDossier>();
  get showFolderDetails$() {
    return this.showFolderDetails.asObservable();
  }

  showFichierDetails = new Subject<IFichier>();
  get showFichierDetails$() {
    return this.showFichierDetails.asObservable();
  }

  newFichier = new Subject<IFichier>();
  get newFichier$() {
    return this.newFichier.asObservable();
  }

  compressingFile = new Subject<{
    upload: Observable<Upload>,
    name: string
  }>();

  get compressingFile$() {
    return this.compressingFile.asObservable();
  }

  // doUploadFile(files) {
  //   setTimeout(() => {
  //   }, 10000);
  //   if(this.is_uploading_file) {
  //     return;
  //   }
  //   this.is_uploading_file = true;
  //   while(this.fichierUpload.some(e => e.upload && e.upload.state == 'PENDING')) {
  //     let index = findLastIndex(this.fichierUpload,e => e.upload && e.upload.state === 'PENDING');
  //     new Promise((resolve, reject) => {
  //       this.fichierUpload[index].observable.subscribe(
  //         {
  //           next: (data: Upload) => {
  //             this.fichierUpload[index].upload = data;
  //              if(data.state == "DONE") {
  //               resolve(true);
  //              }
  //           },
  //           error: err => {
  //               reject(err);
  //           }
  //       });
  //     });
  //   }
  //   this.is_uploading_file = false;
  // }

  constructor() {
  }
}
