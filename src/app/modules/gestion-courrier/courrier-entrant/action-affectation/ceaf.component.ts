import { ICrCourrierEntrant } from 'src/app/core/models/gestion-courrier/cr-courrier-entrant';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-courrier-entrant-action-affectation',
  templateUrl: 'ceaf.component.html'
})

export class CourrierEntrantActionAffectationComponent implements OnInit {
  @Input() courrier: ICrCourrierEntrant;
  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() { }

  onCloseModal(result?: string) {
    this.activeModal.close(result);
  }
}
