import { Component, OnInit } from '@angular/core';
import { BaseEditComponent } from './../../../../shared/base-component/base-edit.component';
import { ConditionsUtilisationsService } from './../conditions-utilisations.service';
import { ConditionsUtilisation } from './../conditions-utilisations.model';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-conditions-utilisations-edit',
  templateUrl: './conditions-utilisations-edit.component.html',
  styleUrls: ['./conditions-utilisations-edit.component.scss'],
})
export class ConditionsUtilisationsEditComponent
  extends BaseEditComponent
  implements OnInit
{
  constructor(
    public conditionUtilisationService: ConditionsUtilisationsService
  ) {
    super(conditionUtilisationService);
  }

  ngOnInit(): void {
    this.subscriptions['conditions-utilisations'] =
      this.conditionUtilisationService.singleData$.subscribe((conditions) => {
        this.form = this.initialiseForm(conditions);
      });
  }

  initialiseForm(conditions?: ConditionsUtilisation) {
    return this.fb.group({
      conditions_utilisations: [
        conditions?.conditions_utilisations,
        Validators.required,
      ],
    });
  }

  update() {
    if (this.form.valid) {
      this.loading = true;
      this.conditionUtilisationService
        .edit(this.form.value)
        .subscribe((conditions) => {
          this.loading = false;
          this.form = this.initialiseForm(conditions);
          this.edited.emit(true);
          this.helper.notification.alertSuccess();
        });
    } else {
      this.helper.notification.alertDanger('Formulaire invalide');
    }
  }
}
