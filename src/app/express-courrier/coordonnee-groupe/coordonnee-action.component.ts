import { CrCoordonneeGroupeFactory } from 'src/app/core/services/gestion-courrier/cr-coordonnee-groupe';
import { CrCoordonneeFactory } from 'src/app/core/services/gestion-courrier/cr-coordonnee';
import { collect, Collection } from 'src/app/shared/models/collection-master/Collection';
import { AuthService } from 'src/app/express-courrier/auth/auth.service';
import { NotificationService } from 'src/app/shared';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, shareReplay } from 'rxjs/operators';
import { AdaptableMapper } from 'src/app/shared/decorator/adapter/adaptable-mapper';
import { Subject } from 'rxjs';
import { Component } from '@angular/core';
import { CrCoordonneeGroupe, ICrCoordonneeGroupe } from '../../core/models/gestion-courrier/cr-coordonnee-groupe';
import { ICrCoordonnee } from '../../core/models/gestion-courrier/cr-coordonnee';
import { ChooseMultiItem2Component } from 'src/app/modules/choose-item/multi2/choose-multi-item2.component';

@Component({
  selector: 'app-coordonne-actions',
  template: 'no template'
})
export class CoordonneeGroupeActionComponent  {

  constructor(
    protected notificationService: NotificationService,
    protected modalService: NgbModal
  ) {}


  onGroupeCoordonnee(coordonneeGrp: ICrCoordonneeGroupe)
  {
    let _result$ = new Subject<Boolean>();
    const modalRef = this.modalService.open(ChooseMultiItem2Component,{  centered: true,  backdrop: 'static' });
    const instance = modalRef.componentInstance as ChooseMultiItem2Component;
    instance.name = 'Coordonnees';
    instance.isLoading = true;
    const service = new CrCoordonneeGroupeFactory();
    service.getAffectations(coordonneeGrp.id).pipe(
      map(
        (data: {data: any}) => {
          if(data.data && data.data.cr_coordonnees) {
            const adapter = new AdaptableMapper(CrCoordonneeGroupe)
            data.data.cr_coordonnees = data.data.cr_coordonnees.map(item => adapter.fromSource(item))
          }
          return collect(data.data);
      })
    ).subscribe(
      (collection: Collection)=>{
        instance.placeholder = 'nouveau coordonnee';
        instance.preselected = collection.get('cr_coordonnees').map(element => element.id);
        const allUserEpingles$ = new CrCoordonneeFactory().list()
        .pipe(shareReplay(1), map(data => data.data));
        instance.dataSource$ = allUserEpingles$;
        instance.isLoading = false;

        instance.multipleItemChoosen.subscribe(
          (cr_coordonnees: ICrCoordonnee[]) => {
            service.setAffectations(coordonneeGrp.id, {
              cr_coordonnees : cr_coordonnees
            }).subscribe((res: {message: string, result: {detached , attached}})=>{
              allUserEpingles$.subscribe(
                (data)=> {
                  let allGroupes = collect(data);
                   // Sometimes server send object insteads of array
                  if(res.result.detached instanceof Object)
                  {
                    res.result.detached = Object.values(res.result.detached);
                  }

                  if(res.result.attached instanceof Object)
                  {
                    res.result.attached = Object.values(res.result.attached);
                  }

                  let attached = allGroupes.whereIn('id', res.result.attached).all();
                  let detached = allGroupes.whereIn('id', res.result.detached).all();

                  if(attached.length)
                  {
                    attached.forEach(element => {
                      this.notificationService.body = this.notificationService.body+' "'+element.libelle+'",'
                    });
                    this.notificationService.body = this.notificationService.body.substring(0, this.notificationService.body.length - 1)
                    this.notificationService.onInfo(this.notificationService.body, 'Ajouter');
                    this.notificationService.body = '';
                  }

                  if(detached.length)
                  {
                    detached.forEach(element => {
                      this.notificationService.body = this.notificationService.body+' "'+element.libelle+'",'
                    });
                    this.notificationService.body = this.notificationService.body.substring(0, this.notificationService.body.length - 1)
                    this.notificationService.onInfo(this.notificationService.body, 'Retirer');
                    this.notificationService.body = '';
                  }
                }
              )
              _result$.next(true);
            },()=>{
              _result$.next(false);
            })
        })
      }
    );

    return _result$
  }
}
