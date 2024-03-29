import { QueryOptions, Filter, Sort } from 'src/app/shared/models/query-options';
import { IFichier } from 'src/app/core/models/gestion-document/fichier.model';
import { Component, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppTitleService, CacheService } from 'src/app/shared/services';
import { NotificationService } from 'src/app/shared';
import { CrCourrierEntrantFactory } from 'src/app/core/services/gestion-courrier/cr-courrier-entrant';
import { CrCommentaire, ICrCommentaire } from 'src/app/core/models/gestion-courrier/cr-commentaire';
import { CrCommentaireFactory } from 'src/app/core/services/gestion-courrier/cr-commentaire';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { filterGrp } from 'src/app/shared/models/query-options/query-options.model';

@Component({
  selector: 'app-commentaire-simplelist',
  templateUrl: './commentaire-simplelist.component.html',
})
export class CommentaireSimplelistComponent implements OnDestroy {

    subscription: Subscription = new Subscription();
    @Input() parent: {type: string, id: number};

    @Input()  set init(initData: {filters: filterGrp[], parent: {type: string, id: number}}) {
        this.parent = initData.parent;

        const service = new CrCommentaireFactory();
        service.list(
            new QueryOptions(
                initData.filters,
                [],
                undefined,
                undefined,
                [new Sort('created_at','DESC')]
            )
            ).subscribe(
                (data)=> {
                this.commentaires = data.data;
                this.cdRef.detectChanges();
                this.is_loading_commentaire = false;
        });
    };

    Editor = DecoupledEditor;
    editorData = '';
    is_adding_commentaire = false;
    is_loading_commentaire = true;
    fichiers: File[] = [];
    commentaires: ICrCommentaire[];

    constructor(
        protected cacheService: CacheService,
        protected titleservice: AppTitleService,
        protected service: CrCourrierEntrantFactory,
        protected notificationService: NotificationService,
        protected modalService: NgbModal,
        protected cdRef:ChangeDetectorRef,
    ) { }

    ngOnDestroy()
    {
        this.subscription.unsubscribe();
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
      let message = new CrCommentaire();
      message.libelle = `reponse`;
      message.contenu = this.editorData;

      if(this.fichiers && this.fichiers.length) {
        message['fichier_count'] = this.fichiers.length;
        for(let i = 0; i < this.fichiers.length; i++) {
          message[`fichier${i}`]=this.fichiers[i];
        }
      }

      const service = new CrCommentaireFactory();
      service.create(message).subscribe(
        (data)=> {
          service.attachAffectation(data.id, this.parent.type, this.parent.id).subscribe(
            ()=> {
            }
          );
          this.editorData = '';
          this.fichiers = [];
          this.notificationService.onSuccess('L\'enregistrement a été effectuer' );
          this.is_adding_commentaire= false;
          this.commentaires = this.commentaires ? [...this.commentaires, ...[data]] : [data];
        }
      )
    }
}
