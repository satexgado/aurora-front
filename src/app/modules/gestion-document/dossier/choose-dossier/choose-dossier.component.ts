import { IDossier } from 'src/app/core/models/gestion-document/dossier.model';
import { Filter } from 'src/app/shared/models/query-options/filter.model';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/shared';
import { Input } from '@angular/core';

@Component({
  selector: 'app-zen-choose-dossier',
  templateUrl: 'choose-dossier.component.html'
})

export class ChooseDossierComponent implements OnInit {

  @Output('onSelectItem') selectedItemEmitter = new EventEmitter<IDossier>();
  @Input() hideUpdateDelete = false;
  @Input() hasRacine = false;
  @Input() exceptionId: number[];

  @Input() dossierFilter = [
    {or: false, filters:[
      new Filter('isIns', true, 'eq'),
      new Filter('noParent', true, 'eq'),
    ]},
  ];

  selectDossier: IDossier;

  constructor(
    public activeModal: NgbActiveModal,
    protected notificationService: NotificationService
  ) { }

  ngOnInit() { }

  onSetSelected(dossier: IDossier) {
    this.selectDossier = dossier;
  }

  onValidate() {
    if(!this.selectDossier) {
      return this.notificationService.onInfo('Veuillez Sélectionnez un dossier');
    }
    this.selectedItemEmitter.emit(this.selectDossier);
  }
}
