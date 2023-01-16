import { ResourceScrollableHelper } from 'src/app/shared/state/resource.scrollable.helper';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Filter, QueryOptions, Sort } from 'src/app/shared/models/query-options';

@Component({
  selector: 'app-zen-mes-partage-ui',
  templateUrl: 'mes-partage-ui.component.html'
})

export class ZenMesPartageUiComponent implements OnInit {
  dossierQueryOption: QueryOptions = new QueryOptions(
    [
      {or: false, filters: [
        new Filter('sharedByUser', true, 'eq'),
      ]}
    ],
    [
      'inscription','ged_element'
    ],
    undefined,
    undefined,
    [new Sort('libelle','ASC')]);

    fichierQueryOption: QueryOptions = new QueryOptions(
      [
        {or: false, filters: [
          new Filter('sharedByUser', true, 'eq'),
        ]}
      ],
      [
        'fichier_type', 'inscription', 'ged_element'
      ],
      undefined,
      undefined,
      [new Sort('libelle','ASC')])
  fichierShareHelper: ResourceScrollableHelper;
  constructor(
    public route: ActivatedRoute,
  ) { }

  ngOnInit() { }
}
