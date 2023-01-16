import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BaseCreateComponent } from '../../../../shared/base-component/base-create.component';
import { RolesService } from './../../../roles/roles.service';
import { StructureService } from '../../structure/structure.service';
import { Validators } from '@angular/forms';
import { Employe } from './../employe.model';
import { EmployeService } from '../employe.service';
import { Structure } from './../../structure/structure.model';

@Component({
  selector: 'app-role-employes',
  templateUrl: './role-employes.component.html',
  styleUrls: ['./role-employes.component.scss'],
})
export class RoleEmployesComponent
  extends BaseCreateComponent
  implements OnInit
{
  structure: Structure;
  roleLoading = false;
  roles: any[] = [];
  employe: Employe;

  constructor(
    public roleService: RolesService,
    public employeService: EmployeService,
    public structureService: StructureService
  ) {
    super(employeService);
  }

  ngOnInit(): void {
    this.subscriptions['structure'] =
      this.structureService.singleData$.subscribe((structure) => {
        this.structure = structure;
        this.getRoleByStructure(structure.id);

        this.subscriptions['employe'] =
          this.employeService.singleData$.subscribe((employe) => {
            this.employe = employe;
            this.initForm(employe.role.id);
          });
      });
  }

  search(event: any) {
    let keyword = event.target.value;
    if (!keyword) this.roles = this.roleService.data;
    else {
      this.roles = this.roleService.data.filter((role) =>
        role.libelle.includes(keyword)
      );
    }
  }

  initForm(idRole?: number) {
    this.form = this.fb.group({
      role: [idRole, Validators.required],
    });
  }

  getRoleByStructure(structure: number) {
    this.roleLoading = true;
    this.roleService.getByStructure(structure).subscribe((roles) => {
      this.roles = roles.data;
      this.roleLoading = false;
    });
  }

  update() {
    if (this.form.valid) {
      this.loading = true;
      const data = {
        user: this.employe.user.id,
        role: this.form.controls.role.value,
        poste: this.employe.poste.id,
        fonction: this.employe.fonction.id,
        structure: this.structure.id,
      };
      this.employeService
        .update(this.employe.id, data)
        .subscribe((employe: Employe) => {
          this.created.emit();
          this.helper.notification.alertSuccess();
          this.initForm(employe.role.id);
          this.loading = false;
        });
    } else {
      this.helper.notification.alertDanger('Formulaire invalide');
    }
  }
}
