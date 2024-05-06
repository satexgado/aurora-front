import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { IBase } from 'src/app/core/models/base.interface';

@Component({
    selector: 'app-workspace-prodoc',
    templateUrl: 'workspace-prodoc.component.html'
})

export class WorkspaceProdocComponent implements OnInit {
    @Input() parentData: { relationName: string, relationId: number | any[] } = null;
    subscription: Subscription = new Subscription();

    constructor(
        public router: Router,
        public route: ActivatedRoute,
        protected modalService: NgbModal
    ) { }

    ngOnInit() {
        this.route.parent.data.subscribe(
            (res) => {
                let parent = res.data.parent as IBase;
                this.parentData = {
                    relationId: parent.id,
                    relationName: this.route.routeConfig.data['folder_parent']
                };
                //   this.init = [
                //     {or: false, filters:[
                //       new Filter(this.route.routeConfig.data['for_search_parent']??this.route.routeConfig.data['folder_parent'], parent.id, 'eq'),
                //     ]},
                //   ];
            }
        )
    }

    open(content) {
        const modalRef = this.modalService.open(content, { size: 'lg', centered: true, backdrop: 'static' });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}