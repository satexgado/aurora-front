import { IModuleUtilisateur } from './../../../../core/models/adm/module-utilisateur';
import { map } from 'rxjs/operators';
import { QueryOptions } from './../../../../shared/models/query-options/query-options.model';
import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { ModuleUtilisateurFactory } from '../../../../core/services/adm/module-utilisateur';
import { Filter } from '../../../../shared/models/query-options/filter.model';

@Component({
  selector: 'app-module-utilisateur',
  templateUrl: 'module-utilisateur.component.html'
})

export class ModuleUtilisateurComponent implements OnInit {


  @Input('modules') modules: IModuleUtilisateur[];
  constructor() { }

  ngOnInit() { }
}
