import { IFichier } from 'src/app/core/models/gestion-document/fichier.model';
import { CrCommentaireFactory } from 'src/app/core/services/gestion-courrier/cr-commentaire';
import { ICrCommentaire, CrCommentaire } from 'src/app/core/models/gestion-courrier/cr-commentaire';
import { FormBuilder } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { NotificationService } from 'src/app/shared';
import { Filter, QueryOptions, Sort } from 'src/app/shared/models/query-options';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-zen-message-details',
  templateUrl: 'message-details.component.html'
})

export class ZenMessageDetailsComponent implements OnInit {

  message: ICrCommentaire;
  Editor = DecoupledEditor;
  editorData = '';
  is_adding_message = false;
  fichiers: File[] = [];
  messages_enfant: ICrCommentaire[];

  @Input('message') set initialisation(message: ICrCommentaire) {
    this.message = message;
    if(!this.message){
      return;
    };
    const service = new CrCommentaireFactory();
    const query =  new QueryOptions(
      [
          {or: true, filters:[
            new Filter('commentaire', message.id, 'eq')
          ]},
      ],
      ['fichiers'],
      undefined,
      undefined,
      [new Sort('updated_at','DESC')]
    );
    service.list(query).subscribe(
      (data)=> {
        this.messages_enfant = data.data;
      }
    )
  }

  constructor(
    protected formBuilder: FormBuilder,
    protected notificationService: NotificationService,
    protected modalService: NgbModal
  ) { }

  ngOnInit() {}

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

  onSendMessage() {
    this.is_adding_message= true;
    let message = new CrCommentaire();
    message.libelle = `reponse : ${this.message.libelle}`;
    message.contenu = this.editorData;
    message.commentaire_id = this.message.id;
    if(this.fichiers && this.fichiers.length) {
      message['fichier_count'] = this.fichiers.length;
      for(let i = 0; i < this.fichiers.length; i++) {
        message[`fichier${i}`]=this.fichiers[i];
      }
    }
    const service = new CrCommentaireFactory();
    service.create(message).subscribe(
      (data)=> {
        console.log(data);
        this.editorData = '';
        this.fichiers = [];
        this.notificationService.onSuccess('L\'enregistrement a été effectuer' );
        this.is_adding_message= false;
        this.messages_enfant = this.messages_enfant ? [...this.messages_enfant, ...[data]] : [data];
      }
    )
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

}
