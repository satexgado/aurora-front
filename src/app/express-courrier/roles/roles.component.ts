import { RolesService } from './roles.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseContainerComponent } from './../../shared/base-component/base-container.component';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
})
export class RolesComponent extends BaseContainerComponent {
  constructor(
    public rolesService: RolesService,
    public route: ActivatedRoute,
    public router: Router
  ) {
    super(rolesService, router, route, 'roles');
  }

  /* ONDESTROY */
  ngOnDestroy(): void {
    this.unsubscribe(this.subscriptions);
    this.helper.modal.hide(`${this.element}-show-modal`);
  }
}
