import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TunelComponent } from './tunel/tunel.component';
import { SharedModule } from '../../shared/shared.module';
import { ReactionTunelModule } from './reaction-tunel/reaction-tunel.module';

@NgModule({
  declarations: [TunelComponent],
  imports: [CommonModule, SharedModule, ReactionTunelModule],
  exports: [TunelComponent],
})
export class TunelModule {}
