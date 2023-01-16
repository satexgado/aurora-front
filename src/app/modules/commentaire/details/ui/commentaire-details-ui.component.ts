import { CommentaireFactory } from 'src/app/core/services/commentaire';
import { Commentaire } from 'src/app/core/models/commentaire';
import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit, Output, EventEmitter} from '@angular/core';
import { checkOverflow } from 'src/app/shared/helperfonction';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

@Component({
  selector: 'app-commentaire-details-ui',
  templateUrl: './commentaire-details-ui.component.html'
})
export class CommentaireDetailsUiComponent implements  AfterViewInit{
  @Input() isAuthor: boolean;
  commentaire: Commentaire;
  @Output() loadResponse = new EventEmitter<Commentaire>();
  @Output() reply = new EventEmitter<Commentaire>();
  editorData = '';
  Editor = DecoupledEditor;
  is_updating = false;
  show_update_form = false;
  isFullView = false;
  isOverflow = false;
  @Input() isTopLevelComment;
  service = new CommentaireFactory();
  @Input('commentaire') set initCommentaire(commentaire: Commentaire) {
    this.commentaire = commentaire;
  }
  constructor(private cdRef:ChangeDetectorRef) {
  }

  ngOnInit()
  {

  }

  ngAfterViewInit()
  {
    this.cdRef.detectChanges();
  }

  onToggleView()
  {
      this.isFullView = !this.isFullView;
  }

  onLoadResponse()
  {
      this.loadResponse.emit(this.commentaire);
  }

  onReply()
  {
      this.reply.emit(this.commentaire);
  }

  onUpdate(state: boolean)
  {
    this.editorData = this.commentaire.libelle;
    this.show_update_form = state;
  }

  public onReady( editor ) {
    editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
    );
}

  onSubmit()
  {
    this.is_updating = true;
    let commentaire = Object.assign({}, this.commentaire);
    commentaire.libelle = this.editorData;
    this.service.update(commentaire).subscribe(
      (data)=>{
        if(!this.commentaire.children)
        {
          this.commentaire.children = [];
        }
        this.commentaire.children.unshift(data);
        this.is_updating = false;
        this.show_update_form = false;
        this.commentaire = data;
        this.editorData = '';
      }
    );
  }
}
