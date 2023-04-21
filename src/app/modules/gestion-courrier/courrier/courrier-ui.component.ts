import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourrierUiService } from './courrier-ui.service';
import { IFichier } from '../../../core/models/gestion-document/fichier.model';
import { BasicStoreMultipleFileComponent } from 'src/app/modules/gestion-document/fichier/store-fichier/edit.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FichierFactory } from 'src/app/core/services/gestion-document/fichier.factory';
import { Filter, QueryOptions, Sort } from 'src/app/shared/models/query-options';

@Component({
  selector: 'app-courrier-ui',
  templateUrl: 'courrier-ui.component.html',
  styles: [`
    .card-1-hoverable:hover {
      transition: all 3s cubic-bezier(.25, .8, .25, 1);
      box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    }

    .nav-link3.active {
      background-color: antiquewhite;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    }
  `]
})

export class CourrierUiComponent implements OnInit {

  filePreview: IFichier;
  viewFile: 'preview' | 'list' = 'preview';
  fichiers: IFichier[];
  constructor(
    public service: CourrierUiService,
    public route: ActivatedRoute,
    private router: Router,
    protected modalService: NgbModal
  ) { }

  ngOnInit() { 
   let service = new FichierFactory();
   service.list(
    new QueryOptions().setIncludes([
      'fichier_type', 'inscription', 'ged_element'
    ])
   ).subscribe(
    (data)=> {
      this.fichiers = data.data;
    }
   )
  }

  openFileModal() {
    const modalRef = this.modalService.open(BasicStoreMultipleFileComponent, { size: 'lg', centered: true,  backdrop: 'static' });
    const instance = modalRef.componentInstance as BasicStoreMultipleFileComponent;
    instance.fichierEmitter.subscribe(
      (data)=> {

        if(!this.fichiers) {
          this.fichiers = [];
        }
        this.fichiers.unshift(data);
      }
    )
  }

  onToggleFileView() {
    this.viewFile = this.viewFile == 'list' ? 'preview' : 'list';
  }

  onSelectFile(fichier) {
    this.viewFile = 'preview';
    this.filePreview = fichier;
  }

  onDeleteFichier(fichier:IFichier) {
    const index = this.fichiers.findIndex(element => element.id === fichier.id);
    this.fichiers.splice(index, 1);
  }

}
