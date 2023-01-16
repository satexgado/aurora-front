import { Component } from '@angular/core';
import { ReactionSoloComponent } from '../../../reaction/reaction-solo/reaction-solo.component';
import { Reaction } from '../../../reactions/reaction.model';

@Component({
  selector: 'app-reaction-tunel-solo',
  templateUrl: './reaction-tunel-solo.component.html',
  styleUrls: ['./reaction-tunel-solo.component.scss'],
})
export class ReactionTunelSoloComponent extends ReactionSoloComponent {}
