import { Factory } from 'src/app/core/services/factory';
import { CacheService } from 'src/app/shared/services';
import { Component, Input, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import { shareReplay, map, switchMap, retryWhen, delay, take } from 'rxjs/operators';
import { IUser } from 'src/app/core/models/user';
import { UserFactory } from 'src/app/core/services/user.factory';
import { Observable } from 'rxjs';
import { collect } from 'src/app/shared/models/collection-master/Collection';
import { NotificationService } from 'src/app/shared';
import { IBase } from 'src/app/core/models/base.interface';
import { Helper } from 'src/app/helpers/helper/helper';

@Component({
  selector: 'app-share-multiselect2',
  templateUrl: './share-multiselect2.component.html',
})
export class ShareMultiselect2Component   {
  heading = 'classe';
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
    this.is_loading_user = true;
    share_users.pipe
    (
      switchMap(
        (data)=>{
          this.personneControl.setValue(
            data.filter(s => s.personne).map((element) => {
              return element.personne;
            })
          );
          return this.allUsers$;
        }
      ),
      retryWhen(errors => errors.pipe(delay(5000), take(10)))
    ).subscribe(
      (data)=> {
        this.allUsers = data;
        this.is_loading_user = false;
      }
    )
  }

  constructor(
    protected cacheService: CacheService,
    protected notification: NotificationService,
    public helper2: Helper,
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
    let preselectedId  = this.personneControl.value.map((element) => {
      return element.id;
    });
    this.service.setAffectations(
      this.item.id,
      {
        partage_a_personnes: preselectedId
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
