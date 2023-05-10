import { GedPartageFactory } from './../../../core/services/gestion-document/ged-partage.model';
import { map } from 'rxjs/operators';
import { Component, EventEmitter, Inject, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { Filter, QueryOptions, Sort } from 'src/app/shared/models/query-options';
import { SharedBaseComponent } from '../zen-document-share/shared.base.component';
import { ZenFichierUploadService } from '../fichier/fichier-upload.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RenommerComponent as FichierRenommerComponent } from './../fichier/renommer/renommer.component';
import { IFichier } from 'src/app/core/models/gestion-document/fichier.model';
import { FichierFactory } from 'src/app/core/services/gestion-document/fichier.factory';
import { CrCommentaire, ICrCommentaire } from 'src/app/core/models/gestion-courrier/cr-commentaire';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { CrCommentaireFactory } from 'src/app/core/services/gestion-courrier/cr-commentaire';
import { NotificationService } from 'src/app/shared';
import { DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-fichier-item-ui',
  templateUrl: 'fichier-item-ui.component.html'
})

export class FichierItemUiComponent implements OnInit {
  @Input() fichier: IFichier;
  @Input() selected;
  @Input() canSelect = true;
  @Input() selectOnly = false;
  @Input() noAction = false;
  @Input() dossierAdditionalFilter =  [{or: false, filters: [
    new Filter('isIns', true, 'eq'),
  ]}];
  //fichier Fonction
  onUpdateFavorisFichier;
  onTransfertFichier;
  onToggleCacherFichier;
  onToggleBloquerFichier;
  onBloquerFichier;
  onDebloquerFichier;
  onCheckPasswordFichier;
  onShareFichier;
  onDeleteFichier;

  @Output() fichierUpdateEmitter = new EventEmitter<IFichier>();
  @Output() fichierDeleteEmitter = new EventEmitter<IFichier>();
  @Output() fichierTransfertEmitter = new EventEmitter<{fichier:IFichier, dossierId:number}>();
  @Output() fichierSelectEmitter = new EventEmitter<IFichier>();

  // Fichier Commentaire Variable
  Editor = DecoupledEditor;
  editorData = '';
  is_adding_commentaire = false;
  is_loading_commentaire = false;
  fichiers: File[] = [];
  commentaires: ICrCommentaire[];
  showCommentaire = false;

  constructor(
    public fichierService: ZenFichierUploadService,
    protected modalService: NgbModal,
    protected notificationService: NotificationService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
  ) {
    const fichierSharedBaseComponent = new SharedBaseComponent();
    fichierSharedBaseComponent.service = new FichierFactory();

    this.onUpdateFavorisFichier = () => {
      fichierSharedBaseComponent.onUpdateFavoris(this.fichier.ged_element).subscribe(
            (data)=> {
              this.fichier.ged_element.user_favoris = data;
              this.fichierUpdateEmitter.emit(this.fichier);
            }
          )
    };

    this.onCheckPasswordFichier = () => {
      fichierSharedBaseComponent.onCheckPassword(this.fichier).subscribe(
            (data: IFichier)=> {
            if(!data) return;
            this.fichier = data;
            this.fichierUpdateEmitter.emit(this.fichier);
        }
      )
    };

    this.onToggleCacherFichier = () => {
      fichierSharedBaseComponent.onToggleCacherFichier(this.fichier.ged_element).subscribe(
            (data)=> {
             this.fichier.ged_element.cacher = data.cacher;
             this.fichierUpdateEmitter.emit(this.fichier);
        }
      )
    };

    this.onBloquerFichier = () => {
      fichierSharedBaseComponent.onBloquerFichier(this.fichier.ged_element).subscribe(
            (data)=> {
              this.fichier.ged_element.bloquer = data.bloquer;
              this.fichierUpdateEmitter.emit(this.fichier);
        }
      )
    };
    this.onDebloquerFichier = () => {
      fichierSharedBaseComponent.onDebloquerFichier(this.fichier.ged_element).subscribe(
            (data)=> {
              this.fichier.ged_element.bloquer = data.bloquer;
              this.fichierUpdateEmitter.emit(this.fichier);
        }
      )
    };

    this.onDeleteFichier = () => {
      fichierSharedBaseComponent.onDelete(this.fichier).subscribe(
        (data)=> {
          if(!data)
          {
            return;
          }
          this.fichierDeleteEmitter.emit(this.fichier);
        }
      )
    };

    this.onTransfertFichier = () => {
      fichierSharedBaseComponent.onTransfertFichier([this.fichier], null, this.dossierAdditionalFilter).subscribe(
        (data)=> {
         this.fichierTransfertEmitter.emit({
           fichier:this.fichier,
           dossierId: data
         })
        }
      )
    }

    this.onShareFichier = ()=>{
      const service = new GedPartageFactory();
      const queryOpt = new QueryOptions([
        {or: false, filters:[new Filter('element', this.fichier.ged_element.id, 'eq')]},
      ],['personne_inscription']);
      const shared_users = service.list(
        queryOpt
      ).pipe(map(data=> data.data))
      fichierSharedBaseComponent.onShare(this.fichier.ged_element,shared_users);
    }

  }

  ngOnInit() {
  }

  onSelect() {
    this.fichierSelectEmitter.emit(this.fichier);
  }

  onShowUpdateFichierForm(fichier: IFichier) {
    const modalRef = this.modalService.open(FichierRenommerComponent, { size: 'lg', centered: true, backdrop: 'static' });
    const instance = modalRef.componentInstance as FichierRenommerComponent;
    instance.title = `Modifier: ${fichier?.libelle}`;
    instance.item = fichier;
    instance.isUpdating = true;
    instance.newItem.subscribe(
      (data: IFichier) => {
        this.fichier = data;
        this.fichierUpdateEmitter.emit(data);
      }
    );
  }

  public onReady( editor ) {
    editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
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

  onGetIcon(item: IFichier): string {
    const extension = item.fichier.split('.').pop();'';

    switch(extension) {
      case 'jpg': return 'fal fa-file-image';
      case 'jpeg': return 'fal fa-file-image';
      case 'png': return 'fal fa-file-image';
      case 'pdf': return 'fal fa-file-pdf';
      case 'doc': return 'fal fa-file-word';
      case 'docx': return 'fal fa-file-word';
      case 'pdf': return 'fal fa-file-zip';
      default: return 'fal fa-file';
    }
 }

 onCheckIfImage(item: IFichier) {
    const extension = item.fichier.split('.').pop();'';

    if(extension =='jpg' || extension =='jpeg' || extension =='png')
    {
      return true;
    }
    return false;
 }

 onSendCommentaire() {
  this.is_adding_commentaire= true;
  let commentaire = new CrCommentaire();
  commentaire.libelle = `reponse`;
  commentaire.contenu = this.editorData;
  if(this.fichiers && this.fichiers.length) {
    commentaire['fichier_count'] = this.fichiers.length;
    for(let i = 0; i < this.fichiers.length; i++) {
      commentaire[`fichier${i}`]=this.fichiers[i];
    }
  }
  const service = new CrCommentaireFactory();
  service.create(commentaire).subscribe(
    (data)=> {
      service.attachAffectation(data.id, 'ged_elements', this.fichier.ged_element.id).subscribe(
        ()=> {
        }
      );
      this.editorData = '';
      this.fichiers = [];
      this.notificationService.onSuccess('L\'enregistrement a été effectuer' );
      this.is_adding_commentaire= false;
      this.commentaires = this.commentaires ? [ ...[data], ...this.commentaires] : [data];
    }
  )
  }

  onToggleShowCommentaire(){
    this.showCommentaire = !this.showCommentaire;
    if(this.showCommentaire && this.commentaires == null) {
      this.onLoadCommentaires();
    }

    if(this.showCommentaire) {
      this.renderer.addClass(this.document.body, 'main-wrapper');
    } else {
      this.renderer.removeClass(this.document.body, 'main-wrapper');
    }
    
  }

  onLoadCommentaires() {
    if(!this.fichier) {
      return ;
    }
    this.is_loading_commentaire = true;

    const service = new CrCommentaireFactory();

    service.list(
      new QueryOptions(
        [
          {or: false, filters: [
            new Filter('parent_ged_id', this.fichier.ged_element.id, 'eq')
          ]}
        ],
        [],
        undefined,
        undefined,
        [new Sort('created_at','DESC')]
      )
    ).subscribe(
      (data)=> {
        this.commentaires = data.data;
        this.is_loading_commentaire = false;
      }
    )
  }
  
}
