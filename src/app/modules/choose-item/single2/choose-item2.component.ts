
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Resource } from 'src/app/shared/state';
import { Observable } from 'rxjs';
import { NotificationService } from 'src/app/shared';

@Component({
  selector: 'app-choose-item2',
  templateUrl: './choose-item2.component.html',
  styleUrls: ['./choose-item2.component.css']
})
export class ChooseItem2Component implements OnInit {
  @Input() title: string;
  @Output() itemChoosen = new EventEmitter<Resource>();
  @Input() createModal;
  @Output() itemCreated = new EventEmitter<any>();
  @Input() imageCol: string;
  @Input() otherCols: {libelle: string, value: string[]};
  @Input() placeholder = '';
  items: {id: number, libelle: string}[] = [];
  @Input() isLoading = false;
  @Input() cantSelectList: {searchColumn: string, data: any[]}[];
  @Input() cantSelectMsg = 'Vous ne pouvez pas selectionnez cet élément';
  @Input()
  set dataSource$(dataSource: Observable<any[]>) {
    this.isLoading = true;
    dataSource.subscribe(
      (data) => {
        this.items = data;
        this.isLoading = false;
      }
    );
  }

  @Input() closeOnSelect = true;

  constructor(public activeModal: NgbActiveModal, public modalService: NgbModal, public notificationService: NotificationService) {
  }

  ngOnInit() {
  }

  userCanSelect(item): boolean {
    let result = true;
    if(this.cantSelectList) {
      this.cantSelectList.forEach(
        element => {
          if (element.data.includes(item[element.searchColumn])) {
            result = false;
          }
        }
      );
    }
    return result;
  }

  onShowCreateForm() {
    if (this.createModal) {
        const modalRef = this.modalService.open(this.createModal, { size: 'lg', centered: true, backdrop: 'static' });
        modalRef.componentInstance.title = 'Créer';
        modalRef.componentInstance.isUpdating = false;
        modalRef.componentInstance.newItem.subscribe(
          (data: any) => {
            this.items.push(data);
            this.itemCreated.emit(data);
          }
        );
    }
  }

  onChooseItem(item: any) {
    if (!this.userCanSelect(item)) {
      return this.notificationService.onInfo(this.cantSelectMsg);
    }
    this.itemChoosen.emit(item);
    if (this.closeOnSelect) {
      this.activeModal.close('item selected');
    }
  }

  onCloseModal(result: string) {
    this.activeModal.close(result);
  }
}
