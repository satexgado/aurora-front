import { UsersService } from './../../../users/users.service';
import { Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/base-component/base-edit.component';
import { EmployeDependancies } from '../employe.dependancies';
import { EmployeService } from '../employe.service';
import { StructureService } from '../../structure/structure.service';

@Component({
  selector: 'app-employe-edit',
  templateUrl: './employe-edit.component.html',
  styleUrls: ['./employe-edit.component.scss'],
})
export class EmployeEditComponent extends BaseEditComponent implements OnInit {
  reset = new Subject<boolean>();
  structure: any;

  constructor(
    public employeService: EmployeService,
    public dependancies: EmployeDependancies,
    public userService: UsersService,
    public structureService?: StructureService
  ) {
    super(employeService);
  }

  ngOnInit(): void {
    this.subscriptions['employe'] = this.employeService.singleData$.subscribe(
      (employe) => {

        this.single = employe;

        if (!employe.user.email_verified_at) {
          this.userService.singleData = employe.user;
        }

        this.initForm(employe);
      }
    );

    this.subscriptions['structure'] = this.structureService.singleData$.subscribe((structure) => {
        this.structure = structure;
    });
  }

  initForm(employe: any): void {
    this.form = this.fb.group({
      fonction: [employe.poste ? [employe.poste] : null, Validators.required],
      poste: [employe.fonction ? [employe.fonction] : null, Validators.required],
      structure: [employe.structure, Validators.required],
    });
  }

  fillForm(form: FormData): void {
    this.formData = form;

    const data = {
      ...this.form.value,
      poste: this.form.controls.poste.value[0]?.id,
      fonction: this.form.controls.fonction.value[0]?.id,
    };

    Object.keys(data).forEach((key) => this.formData.set(key, data[key]));
  }

  editWithUser(form: FormData): void {
    this.loading = true;

    this.fillForm(form);

    this.employeService.update(this.single.id, this.formData).subscribe(() => {
      this.loading = false;
      this.helper.notification.toastSuccess();
      this.edited.emit();
    });
  }

  // TODO: Faire fonctionner la fonction update
  edit() {
    if (this.form.valid) {
      this.loading = true;
      const data = {
        ...this.form.value,
        poste: this.form.controls.poste.value[0]?.id,
        fonction: this.form.controls.fonction.value[0]?.id,
      };
      this.employeService.update(this.single.id, data).subscribe(() => {
        this.loading = false;
        this.helper.notification.toastSuccess();
        this.edited.emit();
      });
    }
  }
}
