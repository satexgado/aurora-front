import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactionTunelComponent } from './reaction-tunel.component';
import { ReactionTunelListComponent } from './reaction-tunel-list/reaction-tunel-list.component';
import { ReactionTunelCreateComponent } from './reaction-tunel-create/reaction-tunel-create.component';
import { ReactionTunelSoloComponent } from './reaction-tunel-solo/reaction-tunel-solo.component';
import { ReactionTunelEmptyComponent } from './reaction-tunel-empty/reaction-tunel-empty.component';
import { SharedModule } from 'src/app/express-courrier/shared/shared.module';
import { RouterModule } from '@angular/router';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PickerModule } from '@ctrl/ngx-emoji-mart';

@NgModule({
  declarations: [
    ReactionTunelComponent,
    ReactionTunelListComponent,
    ReactionTunelCreateComponent,
    ReactionTunelSoloComponent,
    ReactionTunelEmptyComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    InfiniteScrollModule,
    PickerModule,
  ],
  exports: [ReactionTunelComponent],
})
export class ReactionTunelModule {}
