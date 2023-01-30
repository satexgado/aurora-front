import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from 'src/app/express-courrier/auth/auth.service';
import { Structure } from 'src/app/express-courrier/structure/structure/structure.model';
import { StructureService } from 'src/app/express-courrier/structure/structure/structure.service';
import { BaseListComponent } from 'src/app/shared/base-component/base-list.component';
import { Employe } from '../employe.model';
import { EmployeService } from '../employe.service';

@Component({
  selector: 'app-employe-list',
  templateUrl: './employe-list.component.html',
  styleUrls: ['./employe-list.component.scss'],
})
export class EmployeListComponent extends BaseListComponent implements OnInit {
  structure: Structure;
  shouldSetRole = false;
  constructor(
    public employeService: EmployeService,
    public structureService: StructureService,
    public route: ActivatedRoute,
    public authService: AuthService,
    public router: Router
  ) {
    super(employeService, route, 'employes');
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.getAll();
    // this.subscriptions['structure'] = this.employeService.structure$.subscribe(
    //   (structure) => {
    //     this.structure = structure;
    //     this.route.queryParams.subscribe((params) => {
    //       this.getByStructure(structure.id!, params);
    //     });
    //   }
    // );
  }

  getByStructure(structure: number, params: Params): void {
    this.loading = true;
    this.employeService.getByStructure(structure, params).subscribe({
      error: () => {
        this.loading = false;
      },
      next: () => {
        this.loading = false;
      },
    });
  }

  getAll() {
    this.loading = true;
    this.employeService.get().subscribe(
      {
        error: () => {
          this.loading = false;
        },
        next: () => {
          this.loading = false;
        },
      }
    );
  }

  setRole(employe: any) {
    this.shouldSetRole = true;
    this.employeService.singleData = employe;
    this.helper.modal.show('role-employes-modal');
  }

  onNewRoleSetted() {
    this.helper.modal.hide('role-employes-modal');
  }

  validate(employe: number): void {
    this.helper.notification.confirm(() => {
      this.loading = true;
      this.employeService.validate(employe).subscribe(() => {
        this.loading = false;
        this.helper.notification.toastSuccess();
      });
    });
  }

  resendMailVerification(user: number) {
    this.loading = true;
    this.authService.resendEmailVerification(user).subscribe(
      () => {
        this.helper.notification.toastSuccess(
          "Un mail de confirmation a été renvoyé à l'utilisateur"
        );
        this.loading = false;
      },
      (error) => {
        this.helper.notification.toastSuccess(error.message);
        this.loading = false;
      }
    );
  }

  modifier(employe: Employe) {
    this.employeService.singleData = employe;
  }
}
