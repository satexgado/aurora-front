import { StructureService } from './structure.service';
import { Injectable } from '@angular/core';
import { BaseDependancies } from 'src/app/shared/base-component/base-dependancies';
import { StructureTypeService } from '../structure-type.service';

@Injectable({
  providedIn: 'root',
})
export class StructureDependancies extends BaseDependancies {
  data = {
    types: [],
    structures: [],
  };

  loading = {
    types: false,
    structures: false,
  };

  constructor(
    public structureService: StructureService,
    public typeStructureService: StructureTypeService
  ) {
    super();
  }

  // TODO: Revoir la recuperation du type de structure
  getTypeStructures(callback?: Function): void {
    if (!this.data.types.length) {
      this.loading.types = true;
      this.typeStructureService.all(false).subscribe((types) => {
        this.data.types = types;
        this.loading.types = false;
        if (callback) callback();
      });
    }
  }

  // TODO: Revoir la recuperation des structures
  getStructures(callback?: Function): void {
    if (!this.data.structures.length) {
      this.loading.structures = true;
      this.structureService.all(false).subscribe((structures) => {
        this.data.structures = structures;
        this.loading.structures = false;
        if (callback) callback();
      });
    }
  }
}
