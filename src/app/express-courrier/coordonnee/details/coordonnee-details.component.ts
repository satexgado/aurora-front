import { Component, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppTitleService, CacheService } from 'src/app/shared/services';
import { NotificationService } from 'src/app/shared';
import { ICrCoordonnee } from 'src/app/core/models/gestion-courrier/cr-coordonnee';
import { EditComponent as CoordonneeEditFormComponent} from '../edit/edit.component'

@Component({
  selector: 'app-coordonnee-details',
  templateUrl: './coordonnee-details.component.html',
  styleUrls: ['./coordonnee-details.component.scss'],

})
export class CoordonneeDetailsComponent implements OnDestroy {

    subscription: Subscription = new Subscription();
    @Input('coordonnee')  set initCoordonnee(coordonnee: ICrCoordonnee) {
        this.coordonnee = coordonnee;
    };

    @Output() updatedItem = new EventEmitter<any>();
    coordonnee: ICrCoordonnee;

    constructor(
        protected cacheService: CacheService,
        protected titleservice: AppTitleService,
        protected notificationService: NotificationService,
        private router: Router,
        private route: ActivatedRoute,
        protected modalService: NgbModal
    ) { }

    ngOnInit() {
      let sub = this.route.data.subscribe((data: { coordonnee: ICrCoordonnee }) =>
      {
        if((!data.coordonnee))
        {
          this.router.navigate(['/coordonnee']);
        }
        this.titleservice.setTitle(data.coordonnee.libelle);
        this.initCoordonnee = data.coordonnee;
      });
      this.subscription.add(sub);
    }

    ngOnDestroy()
    {
        this.subscription.unsubscribe();
        this.coordonnee = null;
    }

    onShowUpdateCoordonneeForm() {
      const modalRef = this.modalService.open(CoordonneeEditFormComponent, { size: 'lg', centered: true,  backdrop: 'static' });
      modalRef.componentInstance.item = this.coordonnee;
      modalRef.componentInstance.isUpdating = true;
      modalRef.componentInstance.newItem.subscribe(
        (data) => {
          Object.assign(this.coordonnee,data);
        }
      );
    }

}
