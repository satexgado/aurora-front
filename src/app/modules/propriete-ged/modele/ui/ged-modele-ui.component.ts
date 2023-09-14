import { Component, OnInit } from '@angular/core';
import { EditableListComponent } from 'src/app/shared';
import { EditComponent } from './edit/edit.component';
import { AppTitleService, CacheService } from 'src/app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ResourceScrollableHelper } from 'src/app/shared/state';
import { GedModeleFactory } from 'src/app/core/services/gestion-document/ged-modele.factory';
import { print } from 'src/app/shared/helperfonction';


@Component({
  selector: 'app-ged-modele-ui',
  templateUrl: '-ged-modele-ui.component.html'
})

export class GedModeleUiComponent extends EditableListComponent implements OnInit {

  editModal = EditComponent;

  constructor(
    protected cacheService: CacheService,
    protected titleservice: AppTitleService,
    protected modalService: NgbModal) { 
      super(new ResourceScrollableHelper(new GedModeleFactory()));
    this.titleservice.setTitle('Mes Modeles')
    this.modalService = modalService;
  }

  ngOnInit() {
    this.dataHelper.withoutPaginate = true;
    this.dataHelper.relations = ['structure'];
    super.ngOnInit();
    const service = new GedModeleFactory();

    service.icon().subscribe(print);
  }
}
