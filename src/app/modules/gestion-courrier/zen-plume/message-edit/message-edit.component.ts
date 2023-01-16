import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { BaseEditComponent } from 'src/app/shared/components/edit/base-edit.component';
import { Component, Input, ChangeDetectorRef} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {  FormControl, Validators } from '@angular/forms';
import { CacheService } from 'src/app/shared/services';
import { map, shareReplay } from 'rxjs/operators';
import { CrCommentaire, ICrCommentaire } from 'src/app/core/models/gestion-courrier/cr-commentaire';
import { CrCommentaireFactory } from 'src/app/core/services/gestion-courrier/cr-commentaire';

@Component({
  selector: 'app-message-edit',
  templateUrl: 'message-edit.component.html'
})

export class MessageEditComponent extends BaseEditComponent {
  Editor = DecoupledEditor;
  is_adding_message = false;
  heading = 'message';
  @Input() item: ICrCommentaire = new CrCommentaire();
  fichiers: File[] = [];

    public onReady( editor ) {
      editor.ui.getEditableElement().parentElement.insertBefore(
          editor.ui.view.toolbar.element,
          editor.ui.getEditableElement()
      );
  };

  constructor(
    cdRef:ChangeDetectorRef,
    protected cacheService: CacheService,
    activeModal: NgbActiveModal)
  {
    super(new CrCommentaireFactory(), cdRef, activeModal);
  }

  createFormGroup(item: ICrCommentaire) {
    return this.formBuilder.group({
      'contenu': [item.contenu, Validators.required],
      'libelle': [item.libelle, Validators.required],
      'id': [item.id]
    });
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

  doCreateItem(closeModalAfter: boolean = true) {
    if(this.fichiers && this.fichiers.length) {
      this.editForm.addControl('fichier_count', new FormControl(this.fichiers.length));
      for(let i = 0; i < this.fichiers.length; i++) {
        this.editForm.addControl(`fichier${i}`, new FormControl(this.fichiers[i]));
      }
    }
    super.doCreateItem(closeModalAfter);
  }
}
