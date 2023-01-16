import { Factory } from 'src/app/core/services/factory';
import { CacheService } from 'src/app/shared/services';
import { Component, Input, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import { shareReplay, map, switchMap, retryWhen, delay, take } from 'rxjs/operators';
import { Select2DefaultDirective } from 'src/app/shared/directives';
import { IUser } from 'src/app/core/models/user';
import { UserFactory } from 'src/app/core/services/user.factory';
import { Observable, of } from 'rxjs';
import { collect } from 'src/app/shared/models/collection-master/Collection';
import { NotificationService } from 'src/app/shared';
import { IBase } from 'src/app/core/models/base.interface';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
})
export class ShareComponent   {
  heading = 'classe';
  @ViewChild(Select2DefaultDirective) select2Children: Select2DefaultDirective;
  @Input() item: IBase;
  allUsers: IUser[];
  userSelect2Data$;
  is_loading_user;
  is_loading;
  personneControl = new FormControl(null);
  protected readonly allUsers$ = new UserFactory().list().pipe(
    shareReplay(1),
    map(data => data.data as IUser[])
  );
  @Input() service: Factory<IBase>
  @Input() set init(share_users: Observable<{personne: IUser}[]>) {
    let preselectedId = [];
    this.is_loading_user = true;
    share_users.pipe
    (retryWhen(errors => errors.pipe(delay(5000), take(10))),
      switchMap(
        (data)=> {
          preselectedId  = data.filter(s => s.personne).map((element) => {
            return element.personne.id;
          });
          return this.allUsers$
        }
      ),
      retryWhen(errors => errors.pipe(delay(5000), take(10)))
    ).subscribe(
      (data: IUser[])=>{
        const mappedData  = data.map((element: IUser) => {
          const texte = `${element.libelle}`;
          const result = {id : element.id ,  text: texte, selected: false};
          if (preselectedId.includes(element.id)) {
            result.selected = true;
          }
          return result;
        });
        this.allUsers = data;
        this.is_loading_user = false;
        this.userSelect2Data$ = of(mappedData);
      }
    )
  }

  constructor(
    protected cacheService: CacheService,
    protected notification: NotificationService,
    protected activeModal: NgbActiveModal)
  {
  }

  getUser(id) {
    if(!this.allUsers) {
      return null;
    }
    const filter = this.allUsers.filter(element=> element.id == id);
    return  filter[0];
  }

  onCloseModal(raison) {
    this.activeModal.close(raison);
  }

  onSubmit(closeModalAfter = true) {
    this.is_loading = true;
    this.service.setAffectations(
      this.item.id,
      {
        partage_a_personnes: this.personneControl.value
      }
    ).subscribe(
      (res: {result})=> {
        const response = res.result[this.item.id] as {detached: number[], attached: number[]};
        if(!response) return;
        // Sometimes server send object insteads of array
        if(response.detached instanceof Object)
        {
          response.detached = Object.values(response.detached);
        }

        if(response.attached instanceof Object)
        {
          response.attached = Object.values(response.attached);
        }

        const userCollection = collect(this.allUsers);
        let attached = userCollection.whereIn('id', response.attached).all();
        let detached = userCollection.whereIn('id', response.detached).all();

        if(attached.length)
        {
          attached.forEach(element => {
            this.notification.body = this.notification.body+' "'+element.libelle+'",'
          });
          this.notification.body = this.notification.body.substring(0, this.notification.body.length - 1)
          this.notification.onInfo(this.notification.body, 'Partager avec');
          this.notification.body = '';
        }

        if(detached.length)
        {
          detached.forEach(element => {
            this.notification.body = this.notification.body+' "'+element.libelle+'",'
          });
          this.notification.body = this.notification.body.substring(0, this.notification.body.length - 1)
          this.notification.onInfo(this.notification.body, 'Retirer de');
          this.notification.body = '';
        }


        if(closeModalAfter){
          this.onCloseModal('done');
        }

        this.is_loading =false;
      }
    );
  }

}
