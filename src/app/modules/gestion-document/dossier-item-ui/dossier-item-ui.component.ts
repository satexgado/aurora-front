import { GedPartageFactory } from './../../../core/services/gestion-document/ged-partage.model';
import { map } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Filter, QueryOptions } from 'src/app/shared/models/query-options';
import { SharedBaseComponent } from '../zen-document-share/shared.base.component';
import { ZenFichierUploadService } from '../fichier/fichier-upload.service';
import { EditComponent as DossierEditComponent} from '../dossier/edit/edit.component'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Dossier, IDossier } from 'src/app/core/models/gestion-document/dossier.model';
import { DossierFactory } from 'src/app/core/services/gestion-document/dossier.factory';

@Component({
  selector: 'app-dossier-item-ui',
  templateUrl: 'dossier-item-ui.component.html'
})

export class DossierItemUiComponent implements OnInit {
  @Input() dossier: IDossier;
  @Input() selected;
  @Input() url = "/document/mon-espace";
  @Input() navigation = true;
  @Input() noAction = false;
  @Input() dossierAdditionalFilter =  [{or: false, filters: [
    new Filter('isIns', true, 'eq'),
  ]}];

  //dossier Fonction
  onUpdateFavorisDossier;
  onTransfertDossier;
  onToggleCacherDossier;
  onToggleBloquerDossier;
  onBloquerDossier;
  onDebloquerDossier;
  onCheckPasswordDossier;
  onShareDossier;
  onDeleteDossier;

  @Output() dossierUpdateEmitter = new EventEmitter<IDossier>();
  @Output() dossierDeleteEmitter = new EventEmitter<IDossier>();
  @Output() dossierTransfertEmitter = new EventEmitter<{dossier:IDossier, dossierId:number}>();
  @Output() dossierSelectEmitter = new EventEmitter<IDossier>();
  @Output() dossierGotoEmitter = new EventEmitter<IDossier>();

  constructor(
    public fichierService: ZenFichierUploadService,
    protected modalService: NgbModal,
    private router: Router,
  ) {
    const dossierSharedBaseComponent = new SharedBaseComponent();
    dossierSharedBaseComponent.service = new DossierFactory();

    this.onUpdateFavorisDossier = () => {
      dossierSharedBaseComponent.onUpdateFavoris(this.dossier.ged_element).subscribe(
            (data)=> {
              this.dossier.ged_element.user_favoris = data;
              this.dossierUpdateEmitter.emit(this.dossier);
            }
          )
    };

    this.onCheckPasswordDossier = () => {
      dossierSharedBaseComponent.onCheckPassword(this.dossier).subscribe(
            (data: IDossier)=> {
            if(!data) return;
            this.dossier = data;
            this.dossierUpdateEmitter.emit(this.dossier);
        }
      )
    };
    this.onToggleCacherDossier = () => {
      dossierSharedBaseComponent.onToggleCacherFichier(this.dossier.ged_element).subscribe(
            (data)=> {
             this.dossier.ged_element.cacher = data.cacher;
             this.dossierUpdateEmitter.emit(this.dossier);
        }
      )
    };

    this.onBloquerDossier = () => {
      dossierSharedBaseComponent.onBloquerFichier(this.dossier.ged_element).subscribe(
            (data)=> {
              this.dossier.ged_element.bloquer = data.bloquer;
              this.dossierUpdateEmitter.emit(this.dossier);
        }
      )
    };
    this.onDebloquerDossier = () => {
      dossierSharedBaseComponent.onDebloquerFichier(this.dossier.ged_element).subscribe(
            (data)=> {
              this.dossier.ged_element.bloquer = data.bloquer;
              this.dossierUpdateEmitter.emit(this.dossier);
        }
      )
    };

    this.onDeleteDossier = () => {
      dossierSharedBaseComponent.onDelete(this.dossier).subscribe(
        (data)=> {
          if(!data)
          {
            return;
          }
          this.dossierDeleteEmitter.emit(this.dossier);
        }
      )
    };

    this.onTransfertDossier = () => {
      let currentDossier = new Dossier();
      currentDossier.id = this.dossier.dossier_id;
      dossierSharedBaseComponent.onTransfertDossier(this.dossier, currentDossier, this.dossierAdditionalFilter).subscribe(
        (data)=> {
         this.dossierTransfertEmitter.emit({
           dossier:this.dossier,
           dossierId: data
         })
        }
      )
    }

    this.onShareDossier = ()=>{
      const service = new GedPartageFactory();
      const queryOpt = new QueryOptions([
        {or: false, filters:[new Filter('element', this.dossier.ged_element.id, 'eq')]},
      ],['personne_inscription']);
      const shared_users = service.list(
        queryOpt
      ).pipe(map(data=> data.data))
      dossierSharedBaseComponent.onShare(this.dossier.ged_element,shared_users);
    }

  }

  ngOnInit() { }

  onSelect() {
    this.dossierSelectEmitter.emit(this.dossier);
  }

  onShowUpdateForm() {
    const modalRef = this.modalService.open(DossierEditComponent, { size: 'lg', centered: true, backdrop: 'static' });
    const instance = modalRef.componentInstance as DossierEditComponent;
    instance.title = `Modifier: ${this.dossier?.libelle}`;
    instance.item = this.dossier;
    instance.isUpdating = true;
    instance.newItem.subscribe(
      (data: IDossier) => {
        this.dossier = data;
        this.dossierUpdateEmitter.emit(data);
      }
    );
  }

  onGotoDossier() {
    if(this.navigation) {
      return  this.router.navigate([this.url, this.dossier.id]);
    };
    this.dossierGotoEmitter.emit(this.dossier);
  }
}
