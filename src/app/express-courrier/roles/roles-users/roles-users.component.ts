import { RolesService } from './../roles.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BaseListComponent } from 'src/app/shared/base-component/base-list.component';
import { UsersService } from './../../users/users.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-roles-users',
  templateUrl: './roles-users.component.html',
  styleUrls: ['./roles-users.component.scss'],
})
export class RolesUsersComponent extends BaseListComponent implements OnInit {
  roleId = null;
  constructor(
    public usersService: UsersService,
    public route: ActivatedRoute,
    public roleService: RolesService
  ) {
    super(usersService, route, 'roles-users');
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.subscriptions['role'] = this.roleService.singleData$.subscribe(
      (role) => {
        this.loading = true;
        this.usersService.data = [];
        this.roleId = role.id ?? null;
        this.getData(role.id);
        // this.route.queryParams.subscribe((params) => {
        //   if (params.page && params.per_page) {
        //     return this.getData(role.id, params);
        //   }
        // });
      }
    );
  }

  getData(role: number): void {
    this.loading = true;
    this.usersService.getByRole(role).pipe(
      tap(()=>this.loading = false)
    ).subscribe();
  }

  enleverRole(user: any) {}
}
