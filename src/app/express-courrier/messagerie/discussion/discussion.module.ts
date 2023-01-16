import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscussionComponent } from './discussion.component';
import { RouterModule, Routes } from '@angular/router';
import { DiscussionListComponent } from './discussion-list/discussion-list.component';
import { DiscussionShowComponent } from './discussion-show/discussion-show.component';
import { ReactionModule } from '../reaction/reaction.module';
import { DiscussionSoloComponent } from './discussion-solo/discussion-solo.component';

@NgModule({
  declarations: [
    DiscussionComponent,
    DiscussionListComponent,
    DiscussionShowComponent,
    DiscussionSoloComponent,
  ],
  imports: [CommonModule, ReactionModule, RouterModule, SharedModule],
  exports: [DiscussionComponent],
})
export class DiscussionModule {}
