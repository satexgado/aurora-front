import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/express-courrier/auth/auth.service';
import { ImageHandlerService } from 'src/app/helpers/file-handlers/image-handler.service';
import { ReactionsService } from '../../reactions/reactions.service';
import { ReactionSoloComponent } from '../reaction-solo/reaction-solo.component';

@Component({
  selector: 'app-rebondissement-reaction-solo',
  templateUrl: './rebondissement-reaction-solo.component.html',
  styleUrls: ['./rebondissement-reaction-solo.component.scss'],
})
export class RebondissementReactionSoloComponent
  extends ReactionSoloComponent
  implements OnInit
{
  constructor(
    public reactionService: ReactionsService,
    public authService: AuthService,
    public imageHandlerService: ImageHandlerService
  ) {
    super(reactionService, authService, imageHandlerService);
  }

  ngOnInit(): void {}
}
