import { Injectable } from '@angular/core';
import { GedWorkspaceGroupe } from '../../models/gestion-document/ged-workspace-groupe.model';
import { Factory } from '../factory';


@Injectable({
    providedIn: 'root'
})
export class GedWorkspaceGroupeFactory extends Factory<GedWorkspaceGroupe> {
  protected readonly endpoint: string = 'ged-workspace-groupes';

  constructor() {
    super(GedWorkspaceGroupe)
  }

}
