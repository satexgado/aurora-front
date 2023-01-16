import { Component, OnInit } from '@angular/core';
import { BaseSingleComponent } from './../../../../shared/base-component/base-single.component';
import { FonctionService } from './../fonction.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-fonction-show',
  templateUrl: './fonction-show.component.html',
  styleUrls: ['./fonction-show.component.scss'],
})
export class FonctionShowComponent
  extends BaseSingleComponent
  implements OnInit
{
  constructor(
    public fonctionService: FonctionService,
    public route: ActivatedRoute,
    public router: Router
  ) {
    super(fonctionService);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      let fonctionId = +params.id;
      if (params.id) {
        this.single = this.fonctionService.findItemInDataByID(fonctionId);
        if (this.single) this.helper.modal.show('fonctions-show-modal');
        else this.navigateBack();
      } else {
        this.navigateBack();
      }
    });
  }

  private navigateBack() {
    this.router.navigate(['../'], {
      relativeTo: this.route,
      queryParamsHandling: 'preserve',
    });
  }
}
