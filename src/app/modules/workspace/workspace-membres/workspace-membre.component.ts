import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserChooseMultiItem2Component } from '../../choose-item/user-choose/user-choose-multi-item2.component';
import { CoordonneeChooseMultiItem2Component } from '../../choose-item/coordonnee-choose/coordonnee-choose-multi-item2.component';

@Component({
    selector: 'app-workspace-membre',
    templateUrl: 'workspace-membre.component.html'
})

export class WorkspaceMembreComponent implements OnInit {
    constructor(
        protected modalService: NgbModal
    ) { }

    ngOnInit() { }

    onChooseMembre()
    {
        const modalRef = this.modalService.open(CoordonneeChooseMultiItem2Component,{ size: 'lg', centered: true,  backdrop: 'static' });
        const instance = modalRef.componentInstance as CoordonneeChooseMultiItem2Component;

        instance.multipleItemChoosen.subscribe(
        (data)=>{
            console.log(data);
        }
        )
    }
}