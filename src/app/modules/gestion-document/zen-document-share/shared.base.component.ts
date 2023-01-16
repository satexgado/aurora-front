import { GedElementFactory } from 'src/app/core/services/gestion-document/ged-element.factory';
import { FichierFactory } from './../../../core/services/gestion-document/fichier.factory';
import { IBase } from 'src/app/core/models/base.interface';
import { BloquerComponent } from './bloquer/bloquer.component';
import { ChooseDossierComponent } from './../dossier/choose-dossier/choose-dossier.component';
import { AuthService } from 'src/app/express-courrier/auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/shared';
import { Observable, of, Subject } from 'rxjs';
import { IUser } from 'src/app/core/models/user';
import { Component, Input } from '@angular/core';
import { CheckPassComponent } from './checkpass/checkpass.component';
import { ShareMultiselect2Component as ShareComponent } from './share-multiselect2/share-multiselect2.component';
import { AppInjector } from 'src/app/shared/services';
import { DossierFactory } from 'src/app/core/services/gestion-document/dossier.factory';
import { IDossier } from 'src/app/core/models/gestion-document/dossier.model';
import { Filter } from 'src/app/shared/models/query-options';

@Component({
  selector: 'app-fichier-base',
  template: 'NO TEMPLATE'
})
export class SharedBaseComponent {

  user$: Observable<IUser>;

  @Input()  service: DossierFactory | FichierFactory = new FichierFactory();
  protected notification: NotificationService;
  private loginService: AuthService;
  protected modalService: NgbModal;

  constructor(
  )
  {
    const injector = AppInjector.getInjector();
    this.modalService = injector.get(NgbModal);
    this.notification = injector.get(NotificationService);
    this.loginService = injector.get(AuthService);
    this.user$ = of(this.loginService.user);
  }

  onUpdateFavoris(item: {user_favoris:number, id:number, libelle: string}) {
    const result$ = new Subject<number>();
    const service = new GedElementFactory();
    this.user$.subscribe(
      (data)=> {
        if(item.user_favoris) {
          return service.detachAffectation(item.id, 'favoris', data.id).subscribe(
            ()=>{
              result$.next(0);
              item.user_favoris = 0;
              this.notification.onInfo(` rétiré des favoris`, item.libelle);
            }
          )
        }
        service.attachAffectation(item.id, 'favoris', data.id).subscribe(
          ()=>{
            result$.next(1);
            item.user_favoris = 1;
            this.notification.onInfo(` ajouté aux favoris`, item.libelle);
          }
        );
      }
    )
    return result$;
  }

  onToggleCacherFichier(item: {cacher:number, id:number, libelle: string}) {
    const result$ = new Subject<{cacher:number, id:number, libelle: string}>();
    const service = new GedElementFactory();
    service.update({
      cacher: !item.cacher
    }, item.id).subscribe(
      (data)=> {
        this.notification.onInfo(item.libelle, `${data.cacher ? 'Cacher': 'Exposer'}`);
        result$.next(data);
      }
    )

    return result$;
  }

  onBloquerFichier(item: {bloquer:number, id:number, libelle: string}) {
    const result$ = new Subject<{bloquer:number, id:number, libelle: string}>();
    const modalRef = this.modalService.open(BloquerComponent, { size: 'lg', centered: true,  backdrop: 'static' });
    const instance = modalRef.componentInstance as BloquerComponent;
    instance.item = item;
    instance.newItem.subscribe(
      (data)=> {
        if(data.bloquer && item.bloquer) {
          this.notification.onInfo(item.libelle, 'Mot de passe modifier');
        } else {
          this.notification.onInfo(item.libelle, 'Bloquer');
        }
        result$.next(data);
      }
    )
    return result$;
  }

  onDebloquerFichier(fichier:  {bloquer:number, id:number, libelle: string}) {
    const result$ = new Subject< {bloquer:number, id:number, libelle: string}>();
    const service = new GedElementFactory();

    service.update({
      bloquer: 0
    }, fichier.id).subscribe(
      (data)=> {
        this.notification.onInfo(fichier.libelle,'Débloquer');
        result$.next(data);
      }
    )

    return result$;
  }

  onCheckPassword(item: IBase) {
    const result$ = new Subject<IBase | number>();
    const modalRef = this.modalService.open(CheckPassComponent, { size: 'lg', centered: true,  backdrop: 'static' });
    const instance = modalRef.componentInstance as CheckPassComponent;
    instance.item = item;
    instance.service = this.service;
    instance.result.subscribe(
      (data)=> {
        if(!data) {
          this.notification.onWarning('Mot de passe incorrecte')
        } else {
          this.notification.onSuccess(item.libelle, 'Débloquer');
        }
        result$.next(data);
      }
    )
    return result$;
  }

  onTransfertFichier(items: IBase[], currentFolder: IDossier = null,
      filter = [
      {or: false, filters:[
        new Filter('isIns', true, 'eq'),
        new Filter('noParent', true, 'eq'),
      ]},
    ]) {
    const result$ = new Subject<number>();
    const modalRef = this.modalService.open(ChooseDossierComponent, { size: 'lg', centered: true,  backdrop: 'static' });
    const instance = modalRef.componentInstance as ChooseDossierComponent;
    instance.dossierFilter = filter;
    instance.hideUpdateDelete = true;
    instance.selectedItemEmitter.subscribe(
      (data: IDossier)=> {
        if(currentFolder && data.id == currentFolder.id) {
          return this.notification.onInfo('Fichier dejà present dans ce dossier')
        }
        const fichiersID = items.map((fichier=>fichier.id));
        this.service.setAffectations(
          fichiersID,
          {
            dossiers: [data.id]
          }
        ).subscribe(
          ()=> {
            items.forEach(
              (fichier=> {
                this.notification.onInfo(`Transféré dans le dossier ${data.libelle}`, fichier.libelle);
              })
            )
            result$.next(data.id);
          }
        )
      }
    )
    return result$.asObservable();
  }

  onTransfertDossier(item: IBase, currentFolder: IDossier = null,  filter = [
    {or: false, filters:[
      new Filter('isIns', true, 'eq'),
    ]},
  ]) {
    const result$ = new Subject<number>();
    const modalRef = this.modalService.open(ChooseDossierComponent, { size: 'lg', centered: true,  backdrop: 'static' });
    const instance = modalRef.componentInstance as ChooseDossierComponent;
    instance.hideUpdateDelete = true;
    instance.dossierFilter = filter;
    instance.hasRacine = true;
    instance.exceptionId = [item.id];
    instance.selectedItemEmitter.subscribe(
      (data: IDossier)=> {
        if((currentFolder && data.id == currentFolder.id) || ((!currentFolder)&& !data.id)) {
          return this.notification.onInfo('Dejà present dans ce dossier')
        }
        const service = new DossierFactory();
        service.update(
          {
            dossier_id: data.id
          },
          item.id
        ).subscribe(
          ()=> {
            this.notification.onInfo(`Transféré dans le dossier ${data.libelle}`, item.libelle);
            result$.next(data.id);
          }
        )
      }
    )
    return result$.asObservable();
  }

  onShare(item: IBase, share_users: Observable<{personne: IUser}[]>) {
    const modalRef = this.modalService.open(ShareComponent, { size: 'lg', centered: true,  backdrop: 'static' });
    const instance = modalRef.componentInstance as ShareComponent;
    instance.init = share_users;
    instance.item = item;
    instance.service = new GedElementFactory();
  }

  onDelete(item: IBase) {
    let _result$ = new Subject<boolean>();
    const result$ = _result$.asObservable();
    this.notification.title = 'Suppréssion';

    this.notification.body = 'Êtes-vous sûr(e) de vouloir supprimer?' + ' ' + item.libelle;

    const confirm = () => {
      this.service.delete(item.id).subscribe(
          () => {
            this.notification.onSuccess("L'élément a été supprimé");
          }, () => {
            this.notification.onInfo('l\'élément est utilisé');
          }
        );
      _result$.next(true);
    };

    const cancel = () => {
      _result$.next(false);
    };

    this.notification.bodyMaxLength = 300;
    this.notification.backdrop =  0;
    this.notification.onConfirmation(confirm, cancel);

    this.notification.bodyMaxLength = 80;
    this.notification.backdrop =  -1;
    return result$;
  }

}


