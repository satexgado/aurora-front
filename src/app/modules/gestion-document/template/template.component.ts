import { ZenFichierUploadService } from './../fichier/fichier-upload.service';
import { Component } from '@angular/core';
import { Upload } from 'src/app/shared';
import { Observable } from 'rxjs';
import { IFichierType } from 'src/app/core/models/gestion-document/fichier-type.model';
import { CacheService } from 'src/app/shared/services';
import { FichierTypeFactory } from 'src/app/core/services/gestion-document/fichier-type.factory';
import { map, shareReplay } from 'rxjs/operators';
import { QueryOptions, Sort } from 'src/app/shared/models/query-options';
import { StructureService } from 'src/app/express-courrier/structure/structure/structure.service';
import { AuthService } from 'src/app/express-courrier/auth/auth.service';

@Component({
  selector: 'app-zen-document-template',
  templateUrl: 'template.component.html',
  styleUrls: ['./template.component.css']
})

export class ZenDocumentTemplateComponent  {
  fichierUpload:{
    upload: Observable<Upload>,
    name: string
   }[] = [];

  allTypeFichiers: IFichierType[] = [];
  allUserStructures: any[] = [];

  constructor(
    protected fichierService: ZenFichierUploadService,
    protected cacheService: CacheService,
    protected structureService: StructureService,
    public authService: AuthService
    ) {
    this.fichierUpload = this.fichierService.fichierUpload;
    
    this.cacheService.get(
      'allTypeFichiers',
      new FichierTypeFactory().list(new QueryOptions().setSort([new Sort('libelle','ASC')])).pipe(
        shareReplay(1),
        map(data => data.data)
      ),
      1800000
    ).subscribe(
      (data)=> {
        this.allTypeFichiers = data;
      }
    )

    this.structureService.getByUser(this.authService.user.id).subscribe(
      (data)=> {
        this.allUserStructures = data ? data.data : [];
      }
    )
  }
  time: number = 0;
  display ;
  interval;

 startTimer() {
    console.log("=====>");
    this.interval = setInterval(() => {
      if (this.time === 0) {
        this.time+=5;
      } else if (this.time === 100){
        this.time = 0;
      } else {
        this.time+=5;
      }
      this.display=this.transform(this.time)
    }, 1000);
  }

  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    return minutes + ':' + (value - minutes * 60);
}

transform2(value: number): string {
  var sec_num = value; 
var hours   = Math.floor(sec_num / 3600);
var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
var seconds = sec_num - (hours * 3600) - (minutes * 60);

if (hours   < 10) {hours   = 0;}
if (minutes < 10) {minutes = 0;}
if (seconds < 10) {seconds = 0;}
return hours+':'+minutes+':'+seconds;
}
  pauseTimer() {
    clearInterval(this.interval);
  }
}
