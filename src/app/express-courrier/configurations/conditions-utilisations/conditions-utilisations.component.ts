import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ConditionsUtilisationsService } from './conditions-utilisations.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseSingleComponent } from './../../../shared/base-component/base-single.component';

@Component({
  selector: 'app-conditions-utilisations',
  templateUrl: './conditions-utilisations.component.html',
  styleUrls: ['./conditions-utilisations.component.scss'],
})
export class ConditionsUtilisationsComponent
  extends BaseSingleComponent
  implements OnInit, AfterViewInit
{
  edit = false;
  constructor(
    public conditionUtilisationService: ConditionsUtilisationsService,
    public route: ActivatedRoute,
    public router: Router
  ) {
    super(conditionUtilisationService, route);
  }

  ngOnInit(): void {
    this.loading = true;
    this.conditionUtilisationService.get().subscribe(() => {
      this.loading = false;
    });

    this.subscriptions['conditions-utilisations'] =
      this.conditionUtilisationService.singleData$.subscribe(
        (conditionsUtilisations) => {
          this.single = conditionsUtilisations;
        }
      );
  }

  onEdited() {
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParamsHandling: 'preserve',
    });
    this.helper.modal.hide('conditions-utilisations-edit-modal');
  }

  ngAfterViewInit(): void {
    this.route.fragment.subscribe((fragment) => {
      if (fragment === `edit-conditions-utilisations`) {
        this.edit = true;
        this.helper.modal.toggle(`conditions-utilisations-edit-modal`);
      }
    });
  }
}
