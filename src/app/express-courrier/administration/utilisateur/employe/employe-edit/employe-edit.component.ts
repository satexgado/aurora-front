import { AbstractControl, FormArray, FormControl, Validators } from '@angular/forms';
import { merge, Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/base-component/base-edit.component';
import { EmployeDependancies } from '../employe.dependancies';
import { EmployeService } from '../employe.service';
import { UsersService } from 'src/app/express-courrier/users/users.service';
import { StructureService } from 'src/app/express-courrier/structure/structure/structure.service';
import { map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-employe-edit',
  templateUrl: './employe-edit.component.html',
  styleUrls: ['./employe-edit.component.scss'],
})
export class EmployeEditComponent extends BaseEditComponent implements OnInit {
  reset = new Subject<boolean>();
  removedAffectation: number[] = [];
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
    public userService: UsersService,
    public structureService?: StructureService
  ) {
    super(employeService);
  }

  ngOnInit(): void {
    console.log('something');
    this.subscriptions['employe'] = this.userService.singleData$.subscribe(
      (employe) => {

        this.single = employe;
        this.initForm(employe);
      }
    );
  }

  initForm(employe: any): void {
    let affectation_structures = [];
    console.log(employe);

    if(employe.affectation_structures)
    {
      employe.affectation_structures.forEach(element => {
        affectation_structures.push(this.fb.group({
            id: new FormControl(element.id ? element.id : null),
            fonctions: new FormControl(element.fonctions ? element.fonctions : null, Validators.required),
            poste : new FormControl(element.poste ? [element.poste] : null,Validators.required),
            role : new FormControl(element.role ? [element.role] : null,Validators.required),
            structure : new FormControl(element.structure ? [element.structure] : null, Validators.required),
          })
        );
      });
    }

    this.form = this.fb.group({
      'affectation_structures': this.fb.array(affectation_structures),
    });
  }

  addAffectationStructure() {
    const control = this.form.get('affectation_structures') as FormArray;
    control.push(this.fb.group({
        id: new FormControl(null),
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
    let child = control.at(child_index);
    if(child.get('id').value && !this.removedAffectation.includes(child.get('id').value)) {
      this.removedAffectation.push(child.get('id').value);
    }
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

  fillForm(form: FormData = null): void {
    this.formData = form ? form : new FormData();
    let arrayF = this.form.get('affectation_structures') as FormArray;
    let arrayV =arrayF.controls.map((control: AbstractControl, index: number) => {
        return {
          id: control.value.id ? control.value.id : null,
          poste: control.value.poste ? control.value.poste[0]?.id : null,
          fonctions: control.value.fonctions ? control.value.fonctions.map((element)=>element.id) : null,
          role: control.value.role ? control.value.role[0]?.id : null,
          structure: control.value.structure ? control.value.structure[0]?.id : null,
        }
      }
    );

    const data = {
      ...this.form.value,
      affectation_structures: arrayV,
      removedAffectation: this.removedAffectation
    };

    Object.keys(data).forEach((key) => this.formData.append(key, JSON.stringify(data[key])));
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

    this.fillForm();
    this.employeService.update(this.single.id, this.formData).subscribe(() => {
      this.loading = false;
      this.helper.notification.toastSuccess();
      this.edited.emit();
    });
      // this.loading = true;
      // const data = {
      //   ...this.form.value,
      //   poste: this.form.controls.poste.value[0]?.id,
      //   fonction: this.form.controls.fonction.value[0]?.id,
      // };
      // this.employeService.update(this.single.id, data).subscribe(() => {
      //   this.loading = false;
      //   this.helper.notification.toastSuccess();
      //   this.edited.emit();
      // });
    }
  }


}
