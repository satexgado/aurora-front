import { Component, Input, Output, EventEmitter, OnInit, OnDestroy} from '@angular/core';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { Observable, Subscription } from 'rxjs';
import { CrCommentaire } from 'src/app/core/models/gestion-courrier/cr-commentaire';
import { CrCommentaireFactory } from 'src/app/core/services/gestion-courrier/cr-commentaire';

@Component({
  selector: 'app-commentaire-list',
  templateUrl: './commentaire-list.component.html'
})
export class CommentaireListComponent implements OnInit, OnDestroy{

    Editor = DecoupledEditor;
    subscription = new Subscription();
    isLoadingData = true;
    is_adding_commentaire = false;
    editorData = '';
    @Input() can_load_more;
    @Input() isFullView = true;
    @Input() parent: {type: string, id: number};
    @Input('commentaires$') _commentaires$: Observable<CrCommentaire[]>;
    _commentaires: CrCommentaire[] = [];
    @Output() doToggleView = new EventEmitter<Boolean>();
    @Output() doGetMoreComments = new EventEmitter<Boolean>();
    service = new CrCommentaireFactory();
    writeComment = false;
    constructor() {
    }

    ngOnInit()
    {
      let sub =this._commentaires$.subscribe(
        (data) => {
          this._commentaires = data;
          this.isLoadingData = false;
        }
      )
      this.subscription.add(sub);
    }

    onToggleView()
    {
      this.isFullView = !this.isFullView;
      this.doToggleView.emit(this.isFullView);
    }

    onGetMoreComment()
    {
      this.doGetMoreComments.emit(true);
    }

    public onReady( editor ) {
        editor.ui.getEditableElement().parentElement.insertBefore(
            editor.ui.view.toolbar.element,
            editor.ui.getEditableElement()
        );
    }
    onNewComment()
    {
        this.writeComment = true;
    }

    onSaveComment()
    {
        this.writeComment = false;
    }

    ngOnDestroy()
    {
      this.subscription.unsubscribe();
    }

    onSubmit()
    {
      this.is_adding_commentaire = true;
      let commentaire = new CrCommentaire()
      commentaire.libelle = this.editorData;
      let data = {parent: this.parent };
      data = Object.assign(data, commentaire);
      this.service.create(data).subscribe(
        (data)=>{
          this._commentaires.unshift(data);
          this.is_adding_commentaire = false;
          this.editorData = '';
        }
      );
    }
}
