import { Filter } from 'src/app/shared/models/query-options/filter.model';
import { QueryOptions } from 'src/app/shared/models/query-options';
import { collect, Collection } from 'src/app/shared/models/collection-master/Collection';
import { CrMailTag } from 'src/app/core/models/gestion-courrier/cr-mail-tag';
import { ChooseMultiItem2Component } from './../choose-item/multi2/choose-multi-item2.component';
import { CrMailFactory } from 'src/app/core/services/gestion-courrier/cr-mail';
import { AuthService } from 'src/app/express-courrier/auth/auth.service';
import { ICrMail } from 'src/app/core/models/gestion-courrier/cr-mail';
import { NotificationService } from 'src/app/shared';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {EditComponent as TagEditcomponent} from './tag/edit/edit.component'
import { map, shareReplay } from 'rxjs/operators';
import { AdaptableMapper } from 'src/app/shared/decorator/adapter/adaptable-mapper';
import { CrMailTagFactory } from 'src/app/core/services/gestion-courrier/cr-mail-tag';
import { ICrMailTag } from 'src/app/core/models/gestion-courrier/cr-mail-tag';
import { Subject } from 'rxjs';
import { Component } from '@angular/core';

@Component({
  selector: 'app-gestion-mail-actions',
  template: 'no template'
})
export class MailActionComponent  {

  constructor(
    public authService: AuthService,
    protected notificationService: NotificationService,
    protected modalService: NgbModal
  ) {}

  onUpdateFavoris(mail: ICrMail) {
    let _result$ = new Subject<ICrMail>();

    const service = new CrMailFactory();

    if(mail.user_favoris) {
      service.detachAffectation(mail.id, 'favoris', this.authService.user.id).subscribe(
        ()=>{
          mail.user_favoris = 0;
          _result$.next(mail);
          this.notificationService.onInfo(` rétiré des favoris`, mail.libelle);
        }
      )
    } else {
      service.attachAffectation(mail.id, 'favoris', this.authService.user.id).subscribe(
        ()=>{
          mail.user_favoris = 1;
          _result$.next(mail);
          this.notificationService.onInfo(` ajouté aux favoris`, mail.libelle);
        }
      );
    }

    return _result$;
  }

  onEpingleMail(mail: ICrMail)
  {
    let _result$ = new Subject<Boolean>();
    const modalRef = this.modalService.open(ChooseMultiItem2Component,{  centered: true,  backdrop: 'static' });
    const instance = modalRef.componentInstance as ChooseMultiItem2Component;
    instance.name = 'Labels';
    instance.isLoading = true;
    instance.creationService = new CrMailTagFactory();
    const service = new CrMailFactory();
    service.getAffectations(mail.id).pipe(
      map(
        (data: {data: any}) => {
          if(data.data && data.data.tags) {
            const adapter = new AdaptableMapper(CrMailTag)
            data.data.tags = data.data.tags.map(item => adapter.fromSource(item))
          }
          return collect(data.data);
      })
    ).subscribe(
      (collection: Collection)=>{
        instance.placeholder = 'nouvel épingle';
        instance.preselected = collection.get('tags').map(element => element.id);
        const allUserEpingles$ = new CrMailTagFactory().list(
          new QueryOptions(
              [
                  {or: false, filters: [new Filter('isIns', true, 'eq')]},
              ]
            )
          )
        .pipe(shareReplay(1), map(data => data.data));
        instance.dataSource$ = allUserEpingles$;
        instance.isLoading = false;

        instance.multipleItemChoosen.subscribe(
          (tags: ICrMailTag[]) => {


            service.setAffectations(mail.id, {
              tags : tags
            }).subscribe((res: {message: string, result: {detached , attached}})=>{
              allUserEpingles$.subscribe(
                (data)=> {
                  let allEpingles = collect(data);
                   // Sometimes server send object insteads of array
                  if(res.result.detached instanceof Object)
                  {
                    res.result.detached = Object.values(res.result.detached);
                  }

                  if(res.result.attached instanceof Object)
                  {
                    res.result.attached = Object.values(res.result.attached);
                  }

                  let attached = allEpingles.whereIn('id', res.result.attached).all();
                  let detached = allEpingles.whereIn('id', res.result.detached).all();

                  if(attached.length)
                  {
                    attached.forEach(element => {
                      this.notificationService.body = this.notificationService.body+' "'+element.libelle+'",'
                    });
                    this.notificationService.body = this.notificationService.body.substring(0, this.notificationService.body.length - 1)
                    this.notificationService.onInfo(this.notificationService.body, 'Ajouter à');
                    this.notificationService.body = '';
                  }

                  if(detached.length)
                  {
                    detached.forEach(element => {
                      this.notificationService.body = this.notificationService.body+' "'+element.libelle+'",'
                    });
                    this.notificationService.body = this.notificationService.body.substring(0, this.notificationService.body.length - 1)
                    this.notificationService.onInfo(this.notificationService.body, 'Retirer de');
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
