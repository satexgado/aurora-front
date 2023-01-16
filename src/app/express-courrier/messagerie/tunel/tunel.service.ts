import { tap } from 'rxjs/operators';
import { Discussion } from './../discussion/discussion.model';
import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Correspondance } from '../discussion/discussion.model';
import { DiscussionService } from '../discussion/discussion.service';
import { Storage } from 'src/app/helpers/storage/storage';
import { Tunel } from './tunel.model';

@Injectable({
  providedIn: 'root',
})
export class TunelService extends DiscussionService {
  constructor(public authService: AuthService, public storage: Storage) {
    super();
  }

  getTunel(correspondant: number, typeCorrespondant: number): void {
    let correspondance = this._getCorrespondance(
      correspondant,
      typeCorrespondant
    );

    this.check(correspondance)
      .pipe(
        tap((tunel: Discussion) => {
          this.storage.set<Tunel>('tunel', { tunel_id: tunel.id });
        })
      )
      .subscribe();
  }

  private _getCorrespondance(
    correspondant: number,
    typeCorrespondant: number
  ): Correspondance {
    if (typeCorrespondant == 1) {
      return {
        type: typeCorrespondant,
        user1: this.authService.user.id,
        user2: correspondant,
      };
    } else if (typeCorrespondant == 2) {
      return {
        type: typeCorrespondant,
        user: this.authService.user.id,
        structure: correspondant,
      };
    }

    throw new Error('Type correspondant invalide');
  }
}
