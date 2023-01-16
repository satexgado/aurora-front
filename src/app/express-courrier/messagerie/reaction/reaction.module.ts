import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactionComponent } from './reaction.component';
import { ReactionListComponent } from './reaction-list/reaction-list.component';
import { ReactionCreateComponent } from './reaction-create/reaction-create.component';
import { SharedModule } from '../../shared/shared.module';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ReactionSoloComponent } from './reaction-solo/reaction-solo.component';
import { RebondissementReactionSoloComponent } from './rebondissement-reaction-solo/rebondissement-reaction-solo.component';

@NgModule({
  declarations: [
    ReactionComponent,
    ReactionListComponent,
    ReactionCreateComponent,
    ReactionSoloComponent,
    RebondissementReactionSoloComponent,
  ],
  imports: [CommonModule, SharedModule, PickerModule, InfiniteScrollModule],
  exports: [ReactionComponent, ReactionCreateComponent],
})
export class ReactionModule {}
