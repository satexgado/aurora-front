import { CacheService } from 'src/app/shared/services';
import { AppTitleService } from './../../../../shared/services/app-title.service';
import { IMasqueModuleUtilisateur } from './../../../../core/models/adm/module-utilisateur-masque';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { IModuleUtilisateur } from 'src/app/core/models/adm/module-utilisateur';
import { ModuleUtilisateurFactory } from 'src/app/core/services/adm/module-utilisateur';

@Component({
  selector: 'app-module-utilisateur-tabs-ui',
  templateUrl: './module-utilisateur-tabs-ui.component.html'
})
export class ModuleUtilisateurTabsUiComponent implements OnInit {
  masques: IMasqueModuleUtilisateur[];
  modules: IModuleUtilisateur[];
  isLoadingModules: boolean = true;
  constructor(private route: ActivatedRoute,
    protected cacheService: CacheService,
    protected titleService: AppTitleService,
    ) { }

  ngOnInit() {
    const sub1 = this.route.data
    .subscribe((data: { masques: IMasqueModuleUtilisateur[]})=> {
      this.masques = data.masques;
    });
    const service = this.cacheService.get('allModuleUtilisateurs',new ModuleUtilisateurFactory().list());
    service.subscribe(data=> {
      this.isLoadingModules = false;
      this.modules = data.data
    });
  }

  onGetModulebyMasqueId(id:number) {
    return this.modules.filter((module)=>module.masque_id ===id);
  }

}
