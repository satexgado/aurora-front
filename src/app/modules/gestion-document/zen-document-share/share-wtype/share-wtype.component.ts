import { Factory } from 'src/app/core/services/factory';
import { CacheService } from 'src/app/shared/services';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { shareReplay, map, switchMap, retryWhen, delay, take } from 'rxjs/operators';
import { IUser } from 'src/app/core/models/user';
import { UserFactory } from 'src/app/core/services/user.factory';
import { Observable } from 'rxjs';
import { collect } from 'src/app/shared/models/collection-master/Collection';
import { NotificationService } from 'src/app/shared';
import { IBase } from 'src/app/core/models/base.interface';
import { Helper } from 'src/app/helpers/helper/helper';
import { IGedPartage } from 'src/app/core/models/gestion-document/ged-partage.model';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { GedPartageFactory } from 'src/app/core/services/gestion-document/ged-partage.model';
import { print } from 'src/app/shared/helperfonction';

@Component({
  selector: 'app-share-wtype',
  templateUrl: './share-wtype.component.html',
  animations: [
    trigger('flyInOut', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => *', [
        style({ transform: 'translateX(-100%)' }),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({ transform: 'translateX(100%)' }))
      ])
    ])
  ],
  styles: [`
  .people-list {
    -moz-transition: .5s;
    -o-transition: .5s;
    -webkit-transition: .5s;
    transition: .5s
}

.people-list .chat-list li {
    padding: 10px 15px;
    list-style: none;
    border-radius: 3px
}

.people-list .chat-list li:hover {
    background: #efefef;
    cursor: pointer
}

.people-list .chat-list li.active {
    background: #efefef
}

.people-list .chat-list li .name {
    font-size: 15px
}

.people-list .chat-list img {
    width: 45px;
    border-radius: 50%
}

.people-list img {
    float: left;
    border-radius: 50%
}

.people-list .about {
    float: left;
    padding-left: 8px
}

.people-list .status {
    color: #999;
    font-size: 13px
}
  
  `]
})
export class ShareWTypeComponent   {
  heading = 'classe';
  @Input() item: IBase;
  allUsers: IUser[];
  userSelect2Data$;
  is_loading_user;
  is_loading;
  personneControl = new FormControl(null);
  typeControl = new FormControl('Lecteur');
  sharedForm: FormGroup;
  typeSomething: 'Lecteur' | 'Collaborateur' = 'Lecteur';

  multiSetting = {
    ...this.helper2.dropdownSettings.multi,
    badgeShowLimit: '2',
    text: 'Ajouter des utilisateurs',
    enableCheckAll: false
  };

  protected readonly allUsers$ = new UserFactory().list().pipe(
    shareReplay(1),
    map(data => data.data as IUser[])
  );
  @Input() service: Factory<IBase>;
  @Output('selectedUsers') selectedUsersEmetter = new EventEmitter<IUser[]>();
  @Input() set init(share_users: Observable<IGedPartage[]>) {
    this.is_loading_user = true;
    share_users.pipe
    (
      switchMap(
        (data)=>{
          this.sharedForm = this.createFormGroup(data);
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
    protected formBuilder: FormBuilder,
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
    this.selectedUsersEmetter.emit(
      this.personneControl.value
    );
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

  onItemSelect(item) {
    console.log(item);
  }

  
  createFormGroup(item: IGedPartage[]) {

    let partages =   this.formBuilder.array([]);

    if(item && item.length) {
      item.forEach(
        (field)=> {
          partages.push(this.formBuilder.group({
            'personne': [field.personne.id, Validators.required],
            'personneData': [field.personne, Validators.required],
            'element_id': [field.element_id, Validators.required],
            'access': [field.access, Validators.required],
            id: [field.id]
          }))
        }
      )
    }

    return this.formBuilder.group({
      'removedPartages': [],
      'partages': partages
    });
  }

  addPartages(user:IUser|IUser[]) {
    if(user instanceof Array){
        if(user.length) {
          return user.forEach((element) =>{
            this.insertPartage(element);
          })
        }
        return;
    }
   this.insertPartage(user);
  }

  insertPartage(user:IUser) {
    const control = this.sharedForm.get('partages') as FormArray;
    control.insert(0,this.formBuilder.group({
      'personne': [user.id, Validators.required],
      'personneData': [user, Validators.required],
      'element_id': [this.item.id, Validators.required],
      'access': [this.typeSomething, Validators.required],
      id: [0]
    }));
  }

  onChangeAccessPartages(child_index, access: 'Lecteur' | 'Collaborateur' = 'Lecteur') {
    const control = this.sharedForm.get('partages') as FormArray;
    const data = control.at(child_index).get('access').setValue(access);
  }

  removePartages(child_index, removeFromPersonneControl = false) {
    const control = this.sharedForm.get('partages') as FormArray;
    const data = control.at(child_index).get('id').value;
    if(data) {

      if(removeFromPersonneControl) {
        const personneControlData = this.personneControl.value;
        this.personneControl.setValue(
          personneControlData.filter(element => element.id != data)
        );
      }

      const removeControl = this.sharedForm.get('removedPartages') as FormControl;
      let data = removeControl.value ? removeControl.value : [];
      data.push(control.at(child_index).get('id').value);
      removeControl.setValue(data);
      removeControl.markAsDirty();
      removeControl.markAsTouched();
    }
    control.removeAt(child_index);

    
 }

 getPartagesPersonne(child_index) {
  const control = this.sharedForm.get('partages') as FormArray;
  return control.at(child_index).get('personneData').value ? control.at(child_index).get('personneData').value : null;
 }

 somethingsomething(user:IUser) {
  const control = this.sharedForm.get('partages') as FormArray;
  let data = control.value ? control.value : [];
  const index = data.findIndex(element => element.personne === user.id);
  this.removePartages(index);
 }

 somethingsomething2() {
  const control = this.sharedForm.get('partages') as FormArray;
  control.clear();
 }

 onSubmitSomething(closeModalAfter = true) {
  const service = new GedPartageFactory();
  service.createmulti(this.sharedForm.value).subscribe(
    print
  );
 }
}
