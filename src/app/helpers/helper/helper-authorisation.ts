import { Injectable } from '@angular/core';
import { Storage } from './../storage/storage';

@Injectable({
  providedIn: 'root',
})
export class HelperAuthorisation {
  constructor(public storage: Storage) {}

  check(scope?: string, accees?: 'LECTURE' | 'ECRITURE', structureID?: number) {
    if (this.checkIfUserIsAdmin()) return true;

    if (!scope) return false;

    let structure = structureID || this.storage.get('structure');

    let authorisation = this.getByScopeAndStructure(scope, structure);

    // check if list of authorisation key has an element with the same name as scope
    if (authorisation) {
      // check if the type of access is allowed
      if (!accees) return true;

      if (accees == 'LECTURE')
        return (
          authorisation.authorisation == 'LECTURE' ||
          authorisation.authorisation == 'ECRITURE'
        );

      if (accees == 'ECRITURE')
        return authorisation.authorisation == 'ECRITURE';
    }

    return false;
  }

  checkIfUserIsAdmin(structure?: number) {
    // check if a user is a super admin
    let superAdminAuthorisation = this.getByScopeAndStructure('ADMIN', null);
    if (superAdminAuthorisation?.role == 1) return true;

    // Check if a user is an admin
    let adminAuthorisation = this.getByScopeAndStructure('ADMIN', structure);
    if (adminAuthorisation?.role == '2') return true;

    return false;
  }

  private getByScopeAndStructure(scope: string, structure: number) {
    // get authorisation from local-storage
    let authorisations = this.getAll();

    return authorisations.find(
      (authorisation) =>
        authorisation.scope_name == scope &&
        authorisation.structure == structure
    );
  }

  getAll() {
    return this.storage.get<any>('authorisations') || [];
  }
}
