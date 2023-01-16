import { Component, OnInit } from '@angular/core';
import { BaseSingleComponent } from './../../../../shared/base-component/base-single.component';
import { PosteService } from './../poste.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-poste-show',
  templateUrl: './poste-show.component.html',
  styleUrls: ['./poste-show.component.scss'],
})
export class PosteShowComponent extends BaseSingleComponent implements OnInit {
  constructor(
    public posteService: PosteService,
    public route: ActivatedRoute,
    public router: Router
  ) {
    super(posteService);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      let posteId = +params.id;
      if (params.id) {
        this.single = this.posteService.findItemInDataByID(posteId);
        if (this.single) this.helper.modal.show('postes-show-modal');
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
