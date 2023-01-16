import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { AuthService } from 'src/app/express-courrier/auth/auth.service';
import { Structure } from 'src/app/express-courrier/structure/structure/structure.model';
import { EnregistreurAudioService } from 'src/app/helpers/enregistreur/enregistreur-audio.service';
import { DocumentHandlerService } from 'src/app/helpers/file-handlers/document-handle.service';
import { ImageHandlerService } from 'src/app/helpers/file-handlers/image-handler.service';
import { BaseCreateComponent } from 'src/app/shared/base-component/base-create.component';
import { Discussion } from '../../discussion/discussion.model';
import { Reaction } from '../../reactions/reaction.model';
import { ReactionsService } from '../../reactions/reactions.service';

@Component({
  selector: 'app-reaction-create',
  templateUrl: './reaction-create.component.html',
  styleUrls: ['./reaction-create.component.scss'],
})
export class ReactionCreateComponent
  extends BaseCreateComponent<Reaction>
  implements OnInit
{
  rebondissement: Reaction | undefined | null;
  showEmojiPicker: boolean = false;
  discussion: Discussion | undefined;
  structure: Structure | undefined;
  constructor(
    public imageHandlerService: ImageHandlerService,
    public documentService: DocumentHandlerService,
    public reactionService: ReactionsService,
    public authService: AuthService,
    public enregistreurService: EnregistreurAudioService
  ) {
    super(reactionService);
  }

  addEmoji(event: any) {
    const text = `${this.form.controls.reaction.value || ''}${
      event.emoji.native
    }`;
    this.formValuePatcher('reaction', text);
  }

  ngOnInit(): void {
    this.subscriptions['structure'] = this.reactionService.structure$.subscribe(
      (structure) => {
        this.structure = structure;
      }
    );

    this.subscriptions['discussion'] =
      this.reactionService.discussion$.subscribe((discussion) => {
        this.discussion = discussion;
        this.initialiseForm();
      });

    this.subscriptions['file'] = this.enregistreurService.file$.subscribe(
      (file) => {
        this.formData.append('fichier', file);
        this.create();
      }
    );

    this.subscriptions['rebondissement'] =
      this.reactionService.rebondissement$.subscribe((rebondissement) => {
        this.rebondissement = rebondissement;
        this.formValuePatcher('rebondissement', rebondissement.id as number);
      });
  }

  initialiseForm(): void {
    this.form = this.fb.group({
      discussion: [this.discussion?.id, Validators.required],
      reaction: [null, Validators.required],
      rebondissement: [null, Validators.required],
      structure: [this.structure?.id],
    });
  }

  fileProcess(event: any, type: 'image' | 'document'): void {
    const file = event.target.files[0];
    if (
      (type === 'image' && !this.imageHandlerService.checkImage(file)) ||
      (type === 'document' && !this.documentService.checkDocument(file))
    ) {
      return;
    }

    this.formData.append('fichier', file);
    this.create();
  }

  enregistrer() {
    this.enregistreurService.enregistrer();
  }

  annulerEnregistrement() {
    this.enregistreurService.annulerEnregistrement();
  }

  stopEnregistrer() {
    this.enregistreurService.stopEnregistrer();
  }

  annulerRebondissement(): void {
    this.rebondissement = null;
    this.formValuePatcher('rebondissement', null);
  }

  create(): void {
    if (this.form.controls.reaction.value || this.formData.has('fichier')) {
      this.loading = true;

      // From reactive form to form data
      this.fillFormData(this.helper.object.omitNullValue(this.form.value));

      // Add data to the server
      this.reactionService.store(this.formData).subscribe(() => {
        this.loading = false;
        this.initialiseForm();
        this.rebondissement = null;
        this.formData = new FormData();
      });
    } else {
      this.helper.notification.alertDanger(
        "Erreur lors de l'envoie du message"
      );
    }
  }
}
