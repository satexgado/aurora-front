
import { QueryOptions } from 'src/app/shared/models/query-options/query-options.model';
import { ResourceScrollableHelper } from 'src/app/shared/state/resource.scrollable.helper';
import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { Filter } from 'src/app/shared/models/query-options';
import { CrCommentaire, ICrCommentaire } from 'src/app/core/models/gestion-courrier/cr-commentaire';
import { CrCommentaireFactory } from 'src/app/core/services/gestion-courrier/cr-commentaire';

@Component({
  selector: 'app-commentaire-details',
  templateUrl: './commentaire-details.component.html'
})
export class CommentaireDetailsComponent{
  @Input() isAuthor: boolean;
  isReplying = false;
  is_adding_commentaire = false;
  is_loading_more = false;
  editorData = '';
  Editor = DecoupledEditor;
  commentaire: ICrCommentaire;
  subscription: Subscription;
  comment_page = 1;
  commentaireDataHelper: ResourceScrollableHelper;
  @Input('commentaire') set initCommentaire(commentaire: ICrCommentaire) {
    this.commentaire = commentaire;
    const query = new QueryOptions([
      {or: false, filters:[
          new Filter('commentaire', this.commentaire.id, 'eq'),
      ]}
    ]);
    this.commentaireDataHelper = new ResourceScrollableHelper(
      new CrCommentaireFactory(), query
    );
    this.commentaireDataHelper.pageSize = 10;
  }
  constructor() {
  }

  public onReady( editor ) {
      editor.ui.getEditableElement().parentElement.insertBefore(
          editor.ui.view.toolbar.element,
          editor.ui.getEditableElement()
      );
  }

  onToggleReply(isReplying = true)
  {
      this.isReplying = isReplying;
  }

  onSubmit()
    {
      this.is_adding_commentaire = true;
      let commentaire = new CrCommentaire()
      commentaire.libelle = this.editorData;
      const service = new CrCommentaireFactory();
      let data = {commentaire: this.commentaire.id};
      data = Object.assign(data, commentaire);
      service.create(data).subscribe(
        (data)=>{
          this.commentaireDataHelper.addItem(data);
          this.is_adding_commentaire = false;
          this.editorData = '';
        }
      );
    }
}
