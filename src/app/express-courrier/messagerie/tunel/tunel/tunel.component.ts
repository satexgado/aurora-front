import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/express-courrier/auth/auth.service';
import { Storage } from 'src/app/helpers/storage/storage';
import { BaseSingleComponent } from 'src/app/shared/base-component/base-single.component';
import { Discussion } from '../../discussion/discussion.model';
import { Tunel } from '../tunel.model';
import { TunelService } from '../tunel.service';

@Component({
  selector: 'app-tunel',
  templateUrl: './tunel.component.html',
  styleUrls: ['./tunel.component.scss'],
})
export class TunelComponent
  extends BaseSingleComponent<Discussion>
  implements OnInit
{
  constructor(
    public tunelService: TunelService,
    public authService: AuthService,
    public route: ActivatedRoute,
    public router: Router,
    public storage: Storage
  ) {
    super(tunelService);
  }

  ngOnInit(): void {
    /**
     * Active le derniere le tunel sur lequel le user était et n'a pas fermer
     * si l'application est recharger
     */
    const tunel = this.storage.get<Tunel>('tunel');
    console.log(tunel);

    if (tunel) {
      this.getTunelById(tunel.tunel_id);
    }

    this.tunelService.singleData$.subscribe((tunel) => {
      this.single = tunel;
      this.helper.modal.show('tunel-modal');
    });
  }

  getTunelById(id: number) {
    this.loading = true;
    this.tunelService.show(id).subscribe((tunel) => {
      this.loading = false;
    });
  }
}
