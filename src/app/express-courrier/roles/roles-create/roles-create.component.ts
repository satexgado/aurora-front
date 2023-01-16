import { RolesDependancies } from './../roles.dependancies';
import { RolesService } from './../roles.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { BaseCreateComponent } from './../../../shared/base-component/base-create.component';
import { SlugifyPipe } from './../../../shared/pipes/slugify.pipe';
import { StructureService } from './../../structure/structure/structure.service';
import { TypeAutorisation } from '../autorisations/type-authorisation.enum';

@Component({
  selector: 'app-roles-create',
  templateUrl: './roles-create.component.html',
  styleUrls: ['./roles-create.component.scss'],
})
export class RolesCreateComponent
  extends BaseCreateComponent
  implements OnInit
{
  @ViewChild('panel') panel: NgbAccordion;
  structure: number;
  activePanelId: string;
  activeNavId = 1;
  scopes: any = {};

  constructor(
    public roleService: RolesService,
    public roleDependancies: RolesDependancies,
    public slugifyPipe: SlugifyPipe,
    public structureService: StructureService
  ) {
    super(roleService);
  }

  ngOnInit(): void {
    this.initForm();

    this.subscriptions['structure'] =
      this.structureService.singleData$.subscribe((structure) => {
        this.structure = structure.id;
        this.formValuePatcher('structure', this.structure);
      });
  }

  initForm(): void {
    this.form = this.fb.group({
      libelle: [null, Validators.required],
      structure: [null, Validators.required],
      description: [null],
      authorisations: this.fb.group({}),
    });

    this.roleDependancies.getScopes(() => {
      this.roleDependancies.data.scopes.forEach((scope) => {
        (this.form.get('authorisations') as FormGroup).addControl(
          scope.libelle,
          new FormControl(TypeAutorisation.NEANT, Validators.required)
        );
      });

      this.roleDependancies.data.scopes.forEach((scope) => {
        this.scopes[scope.ensemble]
          ? this.scopes[scope.ensemble].push(scope)
          : (this.scopes[scope.ensemble] = [scope]);
      });

      this.activePanelId = this.slugifyPipe.transform(
        Object.keys(this.scopes)[0]
      );

      this.isFormOk = true;
    });
  }

  isExpanded(panelId: string): boolean {
    return this.panel?.isExpanded(panelId);
  }

  updateAutorisation(formcontrol: string, value: string) {
    (this.form.get('authorisations') as FormGroup)
      .get(formcontrol)!
      .patchValue(value);
  }

  serializeAutorisations(authorisations: FormGroup) {
    return Object.keys(authorisations.value)
      .filter((_) => authorisations.value[_] != 'NEANT')
      .map((key) => {
        return {
          scope: this.roleDependancies.data.scopes.find(
            (scope) => scope.libelle == key
          )?.id,
          authorisation: authorisations.value[key],
        };
      });
  }

  create(...args: any): void {
    if (this.form.valid) {
      this.loading = true;
      const data = {
        ...this.form.value,
        authorisations: this.serializeAutorisations(
          this.form.get('authorisations') as FormGroup
        ),
      };

      this.roleService.store(data).subscribe(() => {
        this.loading = false;
        this.initForm();
        this.formValuePatcher('structure', this.structure);
        this.helper.notification.alertSuccess();
        this.created.emit();
      });
    }
  }
}
