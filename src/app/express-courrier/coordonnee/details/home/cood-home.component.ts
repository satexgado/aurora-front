import { Component, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppTitleService, CacheService } from 'src/app/shared/services';
import { NotificationService } from 'src/app/shared';
import { CrCoordonneeFactory } from 'src/app/core/services/gestion-courrier/cr-coordonnee';
import { EditComponent as CoordonneeEditFormComponent} from '../../edit/edit.component'
import { ICrCoordonnee } from 'src/app/core/models/gestion-courrier/cr-coordonnee';

@Component({
  selector: 'app-coordonnee-details-home',
  templateUrl: './cood-home.component.html',
})
export class CoordonneeDetailsHomeComponent implements OnDestroy {

    subscription: Subscription = new Subscription();
    @Input()  set initCoordonnee(coordonnee: ICrCoordonnee) {
        this.coordonnee = coordonnee;
    };

    coordonnee: ICrCoordonnee;
    is_loading_content = true;

    constructor(
        protected cacheService: CacheService,
        protected titleservice: AppTitleService,
        protected service: CrCoordonneeFactory,
        protected notificationService: NotificationService,
        private router: Router,
        public route: ActivatedRoute,
        protected modalService: NgbModal,
        protected cdRef:ChangeDetectorRef,
    ) { }

    ngOnInit() {
      let sub = this.route.parent.data.subscribe((data: { coordonnee: ICrCoordonnee }) =>
      {
        if((!data.coordonnee))
        {
          this.router.navigate(['/coordonnee']);
        }

        this.is_loading_content = true;
        this.titleservice.setTitle(data.coordonnee.libelle);
        this.coordonnee = data.coordonnee;
      });

      this.subscription.add(sub);
    }

    ngOnDestroy()
    {
        this.subscription.unsubscribe();
        this.coordonnee = null;
    }

    // onShowUpdateCoordonneeForm() {
    //   const modalRef = this.modalService.open(CoordonneeDetailsFormComponent, { size: 'lg', centered: true,  backdrop: 'static' });
    //   modalRef.componentInstance.initCoordonnee = this.coordonnee;
    //   modalRef.componentInstance.isUpdating = true;
    //   modalRef.componentInstance.updatedItem.subscribe(
    //     (data) => {
    //       Object.assign(this.coordonnee,data);
    //     }
    //   );
    // }

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
