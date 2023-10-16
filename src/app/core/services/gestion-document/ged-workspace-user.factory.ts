import { Injectable } from '@angular/core';
import { GedWorkspaceUser } from '../../models/gestion-document/ged-workspace-user.model';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class GedWorkspaceUserFactory extends Factory<GedWorkspaceUser> {
  protected readonly endpoint: string = 'ged-workspace-users';

  constructor() {
    super(GedWorkspaceUser)
  }

}
