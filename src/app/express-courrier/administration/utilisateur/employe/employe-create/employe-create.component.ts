import { Component, OnInit } from '@angular/core';
import { FormArray, Validators, FormControl, AbstractControl } from '@angular/forms';
import { merge, Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { Structure } from 'src/app/express-courrier/structure/structure/structure.model';
import { StructureService } from 'src/app/express-courrier/structure/structure/structure.service';
import { BaseCreateComponent } from 'src/app/shared/base-component/base-create.component';
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
  changesUnsubscribe = new Subject();
  multiParameter2 = {
    singleSelection: false,
    selectAllText: 'Tout selectionner',
    unSelectAllText: 'Tout deselectionner',
    itemsShowLimit: 5,
    labelKey: 'libelle',
    enableSearchFilter: true,
    disabled: false,
  };

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

      this.initForm();
  }

  initForm(employe?: any): void {
    this.form = this.fb.group({
      // fonctions: [null, Validators.required],
      // poste: [null, Validators.required],
      // role: [null, Validators.required],
      // structure: [this.structure?.id, Validators.required],
      affectation_structures: this.fb.array([])
    });
  }

  addAffectationStructure() {
    const control = this.form.get('affectation_structures') as FormArray;
    control.push(this.fb.group({
        fonctions: new FormControl(null, Validators.required),
        poste : new FormControl(null,Validators.required),
        role : new FormControl(null,Validators.required),
        structure : new FormControl(null, Validators.required),
      })
    );
    this.watchForChanges();
  }

  removeAffectationStructure(child_index) {
    const control = this.form.get('affectation_structures') as FormArray;
    control.markAsDirty();
    control.removeAt(child_index);
    this.watchForChanges();
  }

  watchForChanges() {
    // cleanup any prior subscriptions before re-establishing new ones
    this.changesUnsubscribe.next();
    let arrayF = this.form.get('affectation_structures') as FormArray;
    merge(...arrayF.controls.map((control: AbstractControl, index: number) =>
              control.get('role').valueChanges.pipe(
                  takeUntil(this.changesUnsubscribe),
                  map(value => ({ rowIndex: index, control: control, data: value })))
      )).subscribe(changes => {
        let posteCtrl = arrayF.at(changes.rowIndex).get('poste');
        let fonctionCtrl = arrayF.at(changes.rowIndex).get('fonctions');
        let structureCtrl = arrayF.at(changes.rowIndex).get('structure');

        if(changes.data && changes.data[0]?.id == 1) {
          posteCtrl.setValidators(null);
          fonctionCtrl.setValidators(null);
          structureCtrl.setValidators(null);

          posteCtrl.setValue(null);
          fonctionCtrl.setValue(null);
          structureCtrl.setValue(null);

        } else {
          posteCtrl.setValidators([Validators.required]);
          fonctionCtrl.setValidators([Validators.required]);
          structureCtrl.setValidators([Validators.required]);
        }

        posteCtrl.updateValueAndValidity();
        fonctionCtrl.updateValueAndValidity();
        structureCtrl.updateValueAndValidity();

      });

  }

  get affectation_structures() : FormArray {
    return this.form.get("affectation_structures") as FormArray
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
    let arrayF = this.form.get('affectation_structures') as FormArray;
    let arrayV =arrayF.controls.map((control: AbstractControl, index: number) => {
        return {
          poste: control.value.poste ? control.value.poste[0]?.id : null,
          fonctions: control.value.fonctions ? control.value.fonctions.map((element)=>element.id) : null,
          role: control.value.role ? control.value.role[0]?.id : null,
          structure: control.value.structure ? control.value.structure[0]?.id : null,
        }
      }
    );

    const data = {
      ...this.form.value,
      affectation_structures: arrayV
    };

    Object.keys(data).forEach((key) => this.formData.append(key, JSON.stringify(data[key])));
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
