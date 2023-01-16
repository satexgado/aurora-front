import { ResourceScrollableHelper } from './../../../shared/state/resource.scrollable.helper';
import { CommentaireFactory } from 'src/app/core/services/commentaire';
import { Commentaire } from 'src/app/core/models/commentaire';
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy} from '@angular/core';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-commentaire-section-ui',
  templateUrl: './commentaire-section-ui.component.html'
})
export class CommentaireSectionUiComponent implements OnInit, OnDestroy{

    Editor = DecoupledEditor;
    subscription = new Subscription();
    @Input('loading') isLoadingData = true;
    is_adding_commentaire = false;
    editorData = '';
    @Input() can_load_more;
    @Input() isFullView = true;
    @Input() parent: {type: string, id: number};
    @Input('commentaireHelper') commentaireDatahelper: ResourceScrollableHelper;
    @Output() doToggleView = new EventEmitter<Boolean>();
    service = new CommentaireFactory();
    writeComment = false;
    constructor() {
    }

    ngOnInit()
    {
      this.commentaireDatahelper.loadData(1);
    }



    public onReady( editor ) {
        editor.ui.getEditableElement().parentElement.insertBefore(
            editor.ui.view.toolbar.element,
            editor.ui.getEditableElement()
        );
    }

    onToggleView()
    {
      this.isFullView = !this.isFullView;
      this.doToggleView.emit(this.isFullView);
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
      let commentaire = new Commentaire()
      commentaire.libelle = this.editorData;
      let data = {parent: this.parent };
      data = Object.assign(commentaire, data);
      this.service.create(data).subscribe(
        (data)=>{
          this.commentaireDatahelper.addItem(data);
          this.is_adding_commentaire = false;
          this.editorData = '';
        }
      );
    }
}
