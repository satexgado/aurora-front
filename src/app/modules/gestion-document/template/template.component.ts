import { ZenFichierUploadService } from './../fichier/fichier-upload.service';
import { Component, OnInit } from '@angular/core';
import { Upload } from 'src/app/shared';
import { Observable } from 'rxjs';
import { IFichierType } from 'src/app/core/models/gestion-document/fichier-type.model';
import { CacheService } from 'src/app/shared/services';
import { FichierTypeFactory } from 'src/app/core/services/gestion-document/fichier-type.factory';
import { map, shareReplay } from 'rxjs/operators';
import { QueryOptions, Sort } from 'src/app/shared/models/query-options';
import { StructureService } from 'src/app/express-courrier/structure/structure/structure.service';
import { AuthService } from 'src/app/express-courrier/auth/auth.service';
import { IFichier } from 'src/app/core/models/gestion-document/fichier.model';

@Component({
  selector: 'app-zen-document-template',
  templateUrl: 'template.component.html',
  styleUrls: ['./template.component.css']
})

export class ZenDocumentTemplateComponent implements OnInit {
  fichierUpload:{
    upload: Observable<Upload>,
    name: string
   }[] = [];

  allTypeFichiers: IFichierType[] = [];
  allUserStructures: any[] = [];
  isCollapsed  = true;
  isHidden = false;
  fichierRecent: IFichier[] = [];

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

  ngOnInit(): void {
    this.fichierService.newFichier$.subscribe(
      (data)=> {
        this.fichierRecent.unshift(data);
        this.isHidden = false;
      }
    )
  }

  checkLength() {
    return this.fichierRecent.length ? this.fichierRecent.filter(a=> a.upload && a.upload.state == 'IN_PROGRESS').length : 0;
  }

  checkCompletedLength() {
    return this.fichierRecent.length ? this.fichierRecent.filter(a=>!(a.upload && a.upload.state != 'DONE')).length : 0;
  }

  checkProgress() {
    return this.fichierRecent.length ? (this.fichierRecent.filter(a=>a.upload && a.upload.state == 'IN_PROGRESS').map(a => a.upload.progress).reduce(function(a, b){return a + b;}) / this.fichierRecent.filter(a=>a.upload && a.upload.state == 'IN_PROGRESS').length): 0;
  }

  checkSize() {
    return this.fichierRecent.length ? this.fichierRecent.filter(a=>a.upload && a.upload.state == 'IN_PROGRESS').map(a => a.size).reduce(function(a, b){return a + b;}) : 0;
  }

  onCloseDowloadPreview() {
    this.isHidden = true;
  }

}
