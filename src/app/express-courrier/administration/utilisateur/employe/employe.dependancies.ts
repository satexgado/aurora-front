import { Injectable } from '@angular/core';
import { FonctionService } from 'src/app/express-courrier/configurations/fonction/fonction.service';
import { PosteService } from 'src/app/express-courrier/configurations/poste/poste.service';
import { RolesService } from 'src/app/express-courrier/roles/roles.service';
import { Structure } from 'src/app/express-courrier/structure/structure/structure.model';
import { StructureService } from 'src/app/express-courrier/structure/structure/structure.service';
import { BaseDependancies } from 'src/app/shared/base-component/base-dependancies';

@Injectable({
  providedIn: 'root',
})
export class EmployeDependancies extends BaseDependancies {
  data = {
    postes: [],
    structures: [],
    fonctions: [],
    roles: [],
  };

  loading = {
    postes: false,
    fonctions: false,
    structures: false,
    roles: false,
  };

  constructor(
    public posteService: PosteService,
    public fonctionService: FonctionService,
    public structureService: StructureService,
    public roleService: RolesService
  ) {
    super();
  }

  // TODO get poste for specifique structure
  getPostes(callback?: Function): void {
    if (!this.data.postes.length) {
      this.loading.postes = true;
      this.posteService.get().subscribe((response) => {
        this.data.postes = response;
        this.loading.postes = false;
        if (callback) callback();
      });
    } else {
      if (callback) callback();
    }
  }

  // TODO get function for specifique structure
  getFonctions(callback?: Function): void {
    if (!this.data.fonctions.length) {
      this.loading.fonctions = true;
      this.fonctionService.get().subscribe((response) => {
        this.data.fonctions = response;
        this.loading.fonctions = false;
        if (callback) callback();
      });
    } else {
      if (callback) callback();
    }
  }

  getStructures(callback?: Function): void {
    if (!this.data.structures.length) {
      this.loading.structures = true;
      this.structureService.get().subscribe((response) => {
        this.data.structures = response;
        this.loading.structures = false;
        if (callback) callback();
      });
    } else {
      if (callback) callback();
    }
  }

  getRoles(callback?: Function): void {
    if (!this.data.roles.length) {
      this.loading.roles = true;
      this.roleService
        .get()
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
      structures: [],
    };
  }
}
