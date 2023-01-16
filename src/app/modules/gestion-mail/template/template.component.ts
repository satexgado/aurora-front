import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditComponent } from '../edit/edit.component'
@Component({
  selector: 'app-gestion-mail-template',
  templateUrl: 'template.component.html'
})

export class GestionMailTemplateComponent implements OnInit {
  constructor(
    protected modalService: NgbModal
  ) { }

  ngOnInit() {

  }

  onShowMailForm() {
    const modalRef = this.modalService.open(EditComponent, { size: 'lg', centered: true, backdrop: 'static' });
    modalRef.componentInstance.title = 'Nouveau Mail';
  }
}
