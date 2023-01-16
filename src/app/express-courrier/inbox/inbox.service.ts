import { Discussion } from './../messagerie/discussion/discussion.model';
import { DiscussionService } from './../messagerie/discussion/discussion.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InboxService extends DiscussionService {
  constructor() {
    super();
  }
}
