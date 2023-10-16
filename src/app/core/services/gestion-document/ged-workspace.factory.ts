import { Injectable } from '@angular/core';
import { GedWorkspace } from '../../models/gestion-document/ged-workspace.model';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class GedWorkspaceFactory extends Factory<GedWorkspace> {
  protected readonly endpoint: string = 'ged-workspaces';

  constructor() {
    super(GedWorkspace)
  }

}
