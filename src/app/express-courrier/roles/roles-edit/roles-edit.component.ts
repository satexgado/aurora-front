import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SlugifyPipe } from '../../../shared/pipes/slugify.pipe';
import { StructureService } from '../../structure/structure/structure.service';
import { RolesCreateComponent } from '../roles-create/roles-create.component';
import { RolesDependancies } from '../roles.dependancies';
import { RolesService } from '../roles.service';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { TypeAutorisation } from '../autorisations/type-authorisation.enum';
import { Role } from './../roles.model';
import { Scope } from './../../scopes/scopes.model';
import { Authorisation } from '../autorisations/authorisations.model';

@Component({
  selector: 'app-roles-edit',
  templateUrl: './roles-edit.component.html',
  styleUrls: ['./roles-edit.component.scss'],
})
export class RolesEditComponent extends RolesCreateComponent implements OnInit {
  single: Role;
  constructor(
    private cdRef : ChangeDetectorRef,
    public roleService: RolesService,
    public roleDependancies: RolesDependancies,
    public slugifyPipe: SlugifyPipe,
    public structureService: StructureService
  ) {
    super(roleService, roleDependancies, slugifyPipe, structureService);
  }

  ngOnInit(): void {
    this.subscriptions['role'] = this.roleService.singleData$.subscribe(
      (role) => {
        this.single = role;
        this.initForm(role);
      }
    );
  }

  initForm(role?: any): void {
    this.form = this.fb.group({
      libelle: [role.libelle, Validators.required],
      // structure: [role.structure, Validators.required],
      description: [role.description],
      authorisations: this.fb.group({}),
    });

    this.roleDependancies.getScopes(() => {
      this.roleDependancies.data.scopes.forEach((scope) => {
        (this.form.get('authorisations') as FormGroup).addControl(
          scope.libelle,
          new FormControl(TypeAutorisation.NEANT, Validators.required)
        );
      });

      // Update des roles deja existante
      this.single.authorisations?.forEach((authorisation) => {
        (this.form.get('authorisations') as FormGroup)
          .get(authorisation.scope_name)
          ?.patchValue(authorisation.authorisation);
      });

      // Création des ensembles de scopes pour l'organisation en accordion
      this.scopes = {};

      this.roleDependancies.data.scopes.forEach((scope) => {
        this.scopes[scope.ensemble]
          ? this.scopes[scope.ensemble].push(scope)
          : (this.scopes[scope.ensemble] = [scope]);
      });

      this.activePanelId = this.slugifyPipe.transform(
        Object.keys(this.scopes)[0]
      );
      this.cdRef.detectChanges();
      this.isFormOk = true;
    });
  }

  getAuthorisationByScope(scope: string) {
    return this.single.authorisations!.find(
      (authorisation) => authorisation?.scope_name == scope
    );
  }

  update(): void {
    if (this.form.valid) {
      this.loading = true;
      const data = {
        ...this.form.value,
        authorisations: this.serializeAutorisations(
          this.form.get('authorisations') as FormGroup
        ),
      };

      this.roleService.update(this.single.id!, data).subscribe(() => {
        this.loading = false;
        this.helper.notification.alertSuccess();
        this.edited.emit();
      });
    }
  }
}
