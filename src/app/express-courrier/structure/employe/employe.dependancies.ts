import { Injectable } from '@angular/core';
import { BaseDependancies } from '../../../shared/base-component/base-dependancies';
import { RolesService } from './../../roles/roles.service';
import { Structure } from '../structure/structure.model';
import { PosteService } from '../../configurations/poste/poste.service';
import { FonctionService } from '../../configurations/fonction/fonction.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeDependancies extends BaseDependancies {
  data = {
    postes: [],
    fonctions: [],
    roles: [],
  };

  loading = {
    postes: false,
    fonctions: false,
    roles: false,
  };

  constructor(
    public posteService: PosteService,
    public fonctionService: FonctionService,
    public roleService: RolesService
  ) {
    super();
  }

  // TODO get poste for specifique structure
  getPostes(structure: Structure, callback?: Function): void {
    if (!this.data.postes.length) {
      this.loading.postes = true;
      this.posteService.getByStructure(structure).subscribe((response) => {
        this.data.postes = response.data;

        this.loading.postes = false;
        if (callback) callback();
      });
    } else {
      if (callback) callback();
    }
  }

  // TODO get function for specifique structure
  getFonctions(structure: Structure, callback?: Function): void {
    if (!this.data.fonctions.length) {
      this.loading.fonctions = true;
      this.fonctionService.getByStructure(structure).subscribe((response) => {
        this.data.fonctions = response.data;
        this.loading.fonctions = false;
        if (callback) callback();
      });
    } else {
      if (callback) callback();
    }
  }

  getRoles(structure: Structure, callback?: Function): void {
    if (!this.data.roles.length) {
      this.loading.roles = true;
      this.roleService
        .getAllByStructure(structure.id)
        .subscribe((response) => {
          this.data.roles = response;
          this.loading.roles = false;
          if (callback) callback();
        });
    } else {
      if (callback) callback();
    }
  }

  clearDependancies() {
    this.data = {
      postes: [],
      fonctions: [],
      roles: [],
    };
  }
}
