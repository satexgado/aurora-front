import { AffectationTacheEditComponent } from './../../../tache/affectation/affectation.component';
import { CrTacheFactory } from 'src/app/core/services/gestion-courrier/cr-tache';
import { QueryOptions, Filter, Sort } from 'src/app/shared/models/query-options';
import { Component, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppTitleService, CacheService } from 'src/app/shared/services';
import { NotificationService } from 'src/app/shared';
import { CrTacheStatut, ICrTache } from 'src/app/core/models/gestion-courrier/cr-tache';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { CrCommentaire, ICrCommentaire } from 'src/app/core/models/gestion-courrier/cr-commentaire';
import { CrCommentaireFactory } from 'src/app/core/services/gestion-courrier/cr-commentaire';
import { IFichier } from 'src/app/core/models/gestion-document/fichier.model';
import { ICrCourrier } from 'src/app/core/models/gestion-courrier/cr-courrier';
import * as moment from 'moment';

@Component({
  selector: 'app-courrier-details-my-task',
  templateUrl: './ced-my-task.component.html',
  styleUrls: ['./ced-my-task.component.css']
})
export class CourrierEntrantDetailsMyTaskComponent implements OnDestroy {

    subscription: Subscription = new Subscription();

    @Input()  set initCourrier(courrier: ICrCourrier) {
        this.courrier = courrier;
        this.is_loading_schema = true;
        const service = new CrTacheFactory();
        service.list(
          new QueryOptions(
            [
              {or: false, filters: [
                new Filter('courrier_id', this.courrier.id, 'eq'),
              ]},
              {or: false, filters: [
                new Filter('parent_insc', 1, 'eq')
              ]}
            ],
            ['responsables', 'structures', 'inscription'],
            undefined,
            undefined,
            [new Sort('created_at','ASC')]
          )
        ).subscribe(
            (data)=> {
              this.taches = data.data;
              this.cdRef.detectChanges();
              this.is_loading_schema = false;
            })
    };
    courrier: ICrCourrier;
    is_loading_schema = false;
    taches: ICrTache[] = [];
    selectedTask: ICrTache;
    statut_list= CrTacheStatut;
    // Fichier Commentaire Variable
    Editor = DecoupledEditor;
    editorData = '';
    is_adding_commentaire = false;
    is_loading_commentaire = false;
    fichiers: File[] = [];
    commentaires: ICrCommentaire[];

    constructor(
        protected cacheService: CacheService,
        protected titleservice: AppTitleService,
        protected notificationService: NotificationService,
        public router: Router,
        public route: ActivatedRoute,
        protected modalService: NgbModal,
        protected cdRef:ChangeDetectorRef,
    ) { }

    ngOnDestroy()
    {
        this.subscription.unsubscribe();
        this.courrier = null;
    }

    onShowAffectationTacheForm(item: ICrTache, not_affected = false) {
      const modalRef = this.modalService.open(AffectationTacheEditComponent, { size: 'lg', centered: true,  backdrop: 'static' });
      modalRef.componentInstance.title = `Affecter la tache`;
      modalRef.componentInstance.item = item;
      modalRef.componentInstance.isUpdating = true;
      modalRef.componentInstance.newItem.subscribe(
        (data: ICrTache) => {
          Object.assign(item,data);
        }
      );
    }

    onUpdateStatut(item: ICrTache, newStatut: CrTacheStatut) {
      item.statut = newStatut;
      const service = new CrTacheFactory();
      service.update(item).subscribe(
        (data)=> Object.assign(item,data)
      )
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

   onSetSelected(tache: ICrTache) {
     this.selectedTask = tache;
     if(!tache) {
      return this.commentaires = null;
    }
    this.is_loading_commentaire = true;
    const service = new CrCommentaireFactory();

    service.list(
      new QueryOptions(
        [
          {or: false, filters: [
            new Filter('parent_tache_id', tache.id, 'eq')
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
   onSendCommentaire() {
    this.is_adding_commentaire= true;
    let commentaire = new CrCommentaire();
    commentaire.libelle = `reponse tache: `+ this.selectedTask?.libelle;
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
        service.attachAffectation(data.id, 'cr_taches', this.selectedTask.id).subscribe(
          ()=> {
            this.editorData = '';
            this.fichiers = [];
            this.notificationService.onSuccess('L\'enregistrement a été effectuer' );
            this.is_adding_commentaire= false;
            this.selectedTask.comments_count++;
            this.commentaires = this.commentaires ? [ ...[data], ...this.commentaires] : [data];
          }
        );
      }
    )
    }

    isEcheanceExpired(date: Date) {
      // your date logic here, recommend moment.js;
      return moment(date).isBefore(moment(new Date()));
      // or without using moment.js:
      // return product.experationDate.getTime() < currentdate.getTime();
      // or using Date
      // return new Date(product.experationDate).valueOf() < new Date(currentdate).valueOf();
    }
}
