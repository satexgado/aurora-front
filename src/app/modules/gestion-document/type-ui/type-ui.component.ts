import { Component, OnInit } from "@angular/core";
import { ItemSelectHelper } from 'src/app/shared/state';
import { IFichier } from 'src/app/core/models/gestion-document/fichier.model';
import { IFichierType } from "src/app/core/models/gestion-document/fichier-type.model";
import { ResourceScrollableHelper } from "src/app/shared/state/resource.scrollable.helper";
import { ActivatedRoute } from "@angular/router";
import { SharedBaseComponent } from "../zen-document-share/shared.base.component";
import { FichierFactory } from "src/app/core/services/gestion-document/fichier.factory";
import { Filter, QueryOptions, Sort } from "src/app/shared/models/query-options";
import { CacheService } from "src/app/shared/services";
import { FichierTypeFactory } from "src/app/core/services/gestion-document/fichier-type.factory";
import { map, shareReplay } from "rxjs/operators";

@Component({
    selector: 'app-zen-document-type-ui',
    templateUrl: 'type-ui.component.html'
})

export class ZenDocumentTypeUiComponent implements OnInit {
    fichierSelectHelper = new ItemSelectHelper();
    fichierResourceHelper: ResourceScrollableHelper;
    fichiers: IFichier[];
    is_loading_content = true;
    typeFichier: IFichierType;
    typeFichiersList: IFichierType[];
    onTransfertFichier;
    typeFichierFilter: IFichierType[];
    searchTerm: string ='';
    view: 'card' | 'list' =  localStorage.getItem("gedViewType") ? <'card' | 'list'>localStorage.getItem("gedViewType"):  'card';

    constructor(
        private route: ActivatedRoute,
        protected cacheService: CacheService,
    ) {
        const fichierSharedBaseComponent = new SharedBaseComponent();
        fichierSharedBaseComponent.service = new FichierFactory();

        this.onTransfertFichier = (fichiers: IFichier[]) => {
            fichierSharedBaseComponent.onTransfertFichier(fichiers).subscribe(
                (data) => {

                }
            )
        }
    }

    ngOnInit() {
        this.route.data
          .subscribe((data: { type: IFichierType }) => {
            this.typeFichier = data.type;
            this.fichierResourceHelper = new ResourceScrollableHelper(
                new FichierFactory(),
                new QueryOptions(
                    [
                      {or: false, filters: [
                        new Filter('type_id', this.typeFichier.id, 'eq'),
                        new Filter('UserAsAccess', 1, 'eq'),
                      ]}
                    ],
                    [
                      'fichier_type', 'inscription', 'ged_element'
                    ],
                    undefined,
                    undefined,
                    [new Sort('libelle','ASC')]
                  )
            );
            this.fichierResourceHelper.withoutPaginate = true;
            this.fichierResourceHelper.loadData();
          });

          this.cacheService.get(
            'allTypeFichiers',
            new FichierTypeFactory().list(new QueryOptions().setSort([new Sort('libelle','ASC')])).pipe(
              shareReplay(1),
              map(data => data.data)
            ),
            1800000
          ).subscribe((data)=>this.typeFichiersList=data);
    }

    onChangeView(view : 'card' | 'list') {
      this.view = view;
      localStorage.setItem('gedViewType',view);
    }
  
}