import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { BaseCreateComponent } from 'src/app/shared/base-component/base-create.component';
import { Structure } from '../../structure/structure.model';
import { StructureService } from '../../structure/structure.service';
import { EmployeDependancies } from '../employe.dependancies';
import { EmployeService } from '../employe.service';

@Component({
  selector: 'app-employe-create',
  templateUrl: './employe-create.component.html',
  styleUrls: ['./employe-create.component.scss'],
})
export class EmployeCreateComponent
  extends BaseCreateComponent
  implements OnInit
{
  reset = new Subject<boolean>();
  structure: Structure;

  constructor(
    public employeService: EmployeService,
    public dependancies: EmployeDependancies,
    public structureService?: StructureService
  ) {
    super(employeService);
  }

  ngOnInit(): void {
    this.subscriptions['structure'] =
      this.structureService.singleData$.subscribe((structure) => {
        this.structure = structure;
        this.initForm();
      });
  }

  initForm(employe?: any): void {
    this.form = this.fb.group({
      fonction: [null, Validators.required],
      poste: [null, Validators.required],
      role: [null, Validators.required],
      structure: [this.structure?.id, Validators.required],
    });
  }

  resetUserForm(): void {
    this.reset.next(true);
  }

  resetForm(): void {
    this.form.reset();
    this.formData = new FormData();
    this.resetUserForm();
  }

  fillForm(form: FormData): void {
    this.formData = form;

    const data = {
      ...this.form.value,
      poste: this.form.controls.poste.value[0]?.id,
      fonction: this.form.controls.fonction.value[0]?.id,
      role: this.form.controls.role.value[0]?.id,
    };

    Object.keys(data).forEach((key) => this.formData.append(key, data[key]));
  }

  create(form: FormData): void {
    this.loading = true;

    this.fillForm(form);

    this.employeService.store(this.formData).subscribe((response) => {
      this.loading = false;
      this.resetForm();
      this.created.emit();
      this.helper.notification.toastSuccess(
        "Un mail de confirmation a été envoyé à l'utilisateur"
      );
    });
  }
}
