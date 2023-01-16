import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/express-courrier/auth/auth.service';
import { Structure } from 'src/app/express-courrier/structure/structure/structure.model';
import { User } from 'src/app/express-courrier/users/user.model';
import { ImageHandlerService } from 'src/app/helpers/file-handlers/image-handler.service';
import { BaseSoloComponent } from 'src/app/shared/base-component/base-solo.component';
import { Reaction } from '../../reactions/reaction.model';
import { ReactionsService } from '../../reactions/reactions.service';

@Component({
  selector: 'app-reaction-solo',
  templateUrl: './reaction-solo.component.html',
  styleUrls: ['./reaction-solo.component.scss'],
})
export class ReactionSoloComponent
  extends BaseSoloComponent<Reaction>
  implements OnInit
{
  @Input() reversed = false;
  @Input() skipProfile = false;
  rebondissement: Reaction | undefined;
  constructor(
    public reactionService: ReactionsService,
    public authService: AuthService,
    public imageHandlerService: ImageHandlerService
  ) {
    super();
  }

  ngOnInit(): void {
    this.rebondissement = this.element?.rebondissement
      ? (this.element.rebondissement as Reaction)
      : undefined;
  }

  isUser(user: unknown): user is User {
    return User.isUser(user);
  }

  isStructure(structure: unknown): structure is Structure {
    return Structure.isStructure(structure);
  }

  asStructure(structure: Structure | number) {
    return structure as Structure;
  }

  rebondir(): void {
    this.reactionService.rebondissement$.next(this.element);
  }

  supprimer(): void {
    this.helper.notification.confirm(() => {
      this.reactionService.delete(this.element?.id!).subscribe({
        next: () => {
          this.helper.notification.toastSuccess();
        },
      });
    });
  }
}
