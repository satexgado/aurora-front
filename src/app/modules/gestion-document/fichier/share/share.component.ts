import { FichierFactory } from 'src/app/core/services/gestion-document/fichier.factory';
import { IFichier } from 'src/app/core/models/gestion-document/fichier.model';
import { CacheService } from 'src/app/shared/services';
import { Filter, QueryOptions } from 'src/app/shared/models/query-options';
import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import { shareReplay, map, switchMap, retryWhen, delay, take } from 'rxjs/operators';
import { Select2DefaultDirective } from 'src/app/shared/directives';
import { IUser } from 'src/app/core/models/user';
import { UserFactory } from 'src/app/core/services/user.factory';
import { of } from 'rxjs';
import { Collection, collect } from 'src/app/shared/models/collection-master/Collection';
import { NotificationService } from 'src/app/shared';
import { GedPartageFactory } from 'src/app/core/services/gestion-document/ged-partage.model';

@Component({
  selector: 'app-share-fichier',
  templateUrl: './share.component.html',
})
export class ShareFichierComponent   {
  heading = 'classe';
  @ViewChild(Select2DefaultDirective) select2Children: Select2DefaultDirective;
  @Input() fichier: IFichier;
  allUsers: IUser[];
  userSelect2Data$;
  is_loading_user;
  personneControl = new FormControl('');
  protected readonly allUsers$ = new UserFactory().list().pipe(
    shareReplay(1),
    map(data => data.data as IUser[])
  );

  @Input() set init(fichier: IFichier) {
    this.fichier = fichier;
    if(!this.fichier) {
      return;
    }
    let preselectedId = [];
    this.is_loading_user = true;
    const service = new GedPartageFactory();
    const queryOpt = new QueryOptions([
      {or: false, filters:[new Filter('element', this.fichier.ged_element.id, 'eq')]},
    ],['personne_inscription']);
    service.list(queryOpt).pipe
    (retryWhen(errors => errors.pipe(delay(5000), take(10))),
      switchMap(
        (data)=> {
          preselectedId  = data.data.filter(s => s.personne).map((element) => {
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
    const service = new FichierFactory();
    service.setAffectations(
      this.fichier.id,
      {
        partage_a_personness: this.personneControl.value
      }
    ).subscribe(
      (res: {result})=> {
        const response = res.result[this.fichier.id] as {detached: number[], attached: number[]};
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

        if(closeModalAfter){
          this.onCloseModal('done');
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
      }
    );
  }

}
