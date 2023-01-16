import { Filter } from 'src/app/shared/models/query-options/filter.model';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/shared';
import { Input } from '@angular/core';
import { IMpProcedureType } from 'src/app/core/models/marche-public/type-procedure.model';

@Component({
  selector: 'app-zen-choose-procedure',
  templateUrl: 'choose-procedure.component.html'
})

export class ChooseProcedureComponent implements OnInit {

  @Output('onSelectItem') selectedItemEmitter = new EventEmitter<IMpProcedureType>();
  @Input() hideUpdateDelete = false;
  @Input() hasRacine = false;
  @Input() exceptionId: number[];

  @Input() procedureFilter = [
    {or: false, filters:[
      new Filter('isIns', true, 'eq'),
      new Filter('noParent', true, 'eq'),
    ]},
  ];

  selectProcedure: IMpProcedureType;

  constructor(
    public activeModal: NgbActiveModal,
    protected notificationService: NotificationService
  ) { }

  ngOnInit() { }

  onSetSelected(procedure: IMpProcedureType) {
    this.selectProcedure = procedure;
  }

  onValidate() {
    if(!this.selectProcedure) {
      return this.notificationService.onInfo('Veuillez Sélectionnez un procedure');
    }
    this.selectedItemEmitter.emit(this.selectProcedure);
  }
}
