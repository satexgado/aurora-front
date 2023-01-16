import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/shared/base-component/base.component';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-signup-condition-utilisation',
  templateUrl: './signup-condition-utilisation.component.html',
  styleUrls: ['./signup-condition-utilisation.component.scss'],
})
export class SignupConditionUtilisationComponent
  extends BaseComponent
  implements OnInit
{
  conditionsUtilisations!: string;

  constructor(public authService: AuthService) {
    super(authService);
  }

  ngOnInit(): void {
    this.getConditionUtilisation();
  }

  getConditionUtilisation(): void {
    this.loading = true;
    this.authService.getConditionsUtilisation().subscribe({
      next: (response) => {
        this.conditionsUtilisations = response.conditions_utilisations;
      },
    });
  }
}
