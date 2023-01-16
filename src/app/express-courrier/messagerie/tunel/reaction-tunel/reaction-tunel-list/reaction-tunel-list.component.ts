import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/express-courrier/auth/auth.service';
import { DocumentHandlerService } from 'src/app/helpers/file-handlers/document-handle.service';
import { ImageHandlerService } from 'src/app/helpers/file-handlers/image-handler.service';
import { ReactionListComponent } from '../../../reaction/reaction-list/reaction-list.component';
import { ReactionTunelService } from '../reaction-tunel.service';

@Component({
  selector: 'app-reaction-tunel-list',
  templateUrl: './reaction-tunel-list.component.html',
  styleUrls: ['./reaction-tunel-list.component.scss'],
})
export class ReactionTunelListComponent extends ReactionListComponent {
  constructor(
    public reactionService: ReactionTunelService,
    public imageHandlerService: ImageHandlerService,
    public documentService: DocumentHandlerService,
    public authService: AuthService,
    public route: ActivatedRoute
  ) {
    super(
      reactionService,
      imageHandlerService,
      documentService,
      authService,
      route
    );
  }
}
