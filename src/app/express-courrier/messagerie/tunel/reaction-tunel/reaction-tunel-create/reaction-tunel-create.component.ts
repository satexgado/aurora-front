import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { AuthService } from 'src/app/express-courrier/auth/auth.service';
import { EnregistreurAudioService } from 'src/app/helpers/enregistreur/enregistreur-audio.service';
import { DocumentHandlerService } from 'src/app/helpers/file-handlers/document-handle.service';
import { ImageHandlerService } from 'src/app/helpers/file-handlers/image-handler.service';
import { ReactionCreateComponent } from '../../../reaction/reaction-create/reaction-create.component';

import { TunelService } from '../../tunel.service';
import { ReactionTunelService } from '../reaction-tunel.service';

@Component({
  selector: 'app-reaction-tunel-create',
  templateUrl: './reaction-tunel-create.component.html',
  styleUrls: ['./reaction-tunel-create.component.scss'],
})
export class ReactionTunelCreateComponent
  extends ReactionCreateComponent
  implements OnInit
{
  rebondissement: any;
  tunel: any;
  showEmojiPicker: boolean = false;
  constructor(
    public reactionService: ReactionTunelService,
    public tunelService: TunelService,
    public enregistreurService: EnregistreurAudioService,
    public imageService: ImageHandlerService,
    public documentService: DocumentHandlerService,
    public authService: AuthService
  ) {
    super(
      imageService,
      documentService,
      reactionService,
      authService,
      enregistreurService
    );
  }
}
