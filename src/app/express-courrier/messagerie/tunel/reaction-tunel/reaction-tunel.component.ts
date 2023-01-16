import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/express-courrier/auth/auth.service';
import { Structure } from 'src/app/express-courrier/structure/structure/structure.model';
import { User } from 'src/app/express-courrier/users/user.model';
import { Storage } from 'src/app/helpers/storage/storage';
import { BaseComponent } from 'src/app/shared/base-component/base.component';
import { Correspondant, Discussion } from '../../discussion/discussion.model';
import { Reaction } from '../../reactions/reaction.model';
import { TunelService } from '../tunel.service';
import { ReactionTunelService } from './reaction-tunel.service';

interface Tabs {
  message: boolean;
  fichier: boolean;
}

@Component({
  selector: 'app-reaction-tunel',
  templateUrl: './reaction-tunel.component.html',
  styleUrls: ['./reaction-tunel.component.scss'],
})
export class ReactionTunelComponent
  extends BaseComponent<Reaction>
  implements OnInit
{
  tunel: any;
  structure: Structure | undefined;
  correspondant!: Correspondant;
  showTabs = {
    message: true,
    fichier: false,
  };

  constructor(
    public tunelService: TunelService,
    public reactionService: ReactionTunelService,
    public authService: AuthService,
    public router: Router,
    public route: ActivatedRoute,
    public storage: Storage
  ) {
    super(reactionService);
  }

  ngOnInit(): void {
    this.subscriptions['tunel'] = this.tunelService.singleData$.subscribe(
      (tunel) => {
        this.tunel = tunel;
        this.reactionService.discussion$.next(tunel);
        this.correspondant = Discussion.getCorrespondant(
          tunel,
          this.tunelService.structure ? this.structure : this.authService.user
        );
      }
    );

    this.displayTab('message');
  }

  ngAfterViewInit() {
    // this.helper.showModal("discussion-min-modal");
  }

  changeTab(tab: keyof Tabs) {
    this.helper.navigation.addParams(this.route, { tab });
  }

  resetShowTabs() {
    Object.keys(this.showTabs).forEach((key) => {
      this.showTabs[key as keyof Tabs] = false;
    });
  }

  displayTab(tab: keyof Tabs) {
    if (Object.keys(this.showTabs).includes(tab)) {
      this.resetShowTabs();
      this.showTabs[tab] = true;
    }
  }

  isUser(correspondant?: Correspondant): correspondant is User {
    return User.isUser(correspondant);
  }

  fermerTunel() {
    this.storage.delete('tunel');
    this.helper.modal.hide('tunel-modal');
  }
}
