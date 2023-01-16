import { GedElementFactory } from 'src/app/core/services/gestion-document/ged-element.factory';
import { BloquerFichierComponent } from './bloquer/bloquer.component';
import { CheckPassFichierComponent } from './checkpass/checkpass.component';
import { ChooseDossierComponent } from './../dossier/choose-dossier/choose-dossier.component';
import { AuthService } from 'src/app/auth/auth.service';
import { IUser } from 'src/app/core/models/user';
import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/shared';
import { Observable, Subject } from 'rxjs';
import { ShareFichierComponent } from './share/share.component';
import { IFichier } from 'src/app/core/models/gestion-document/fichier.model';
import { FichierFactory } from 'src/app/core/services/gestion-document/fichier.factory';
import { IDossier } from 'src/app/core/models/gestion-document/dossier.model';

@Component({
  selector: 'app-fichier-base',
  template: 'NO TEMPLATE'
})
export class ZenFichierBaseComponent {

  user$: Observable<IUser>;

  constructor(private loginService: AuthService, protected modalService: NgbModal, protected notification: NotificationService)
  {
    this.user$ = this.loginService.userInfo$;
  }

  onUpdateFavoris(fichier: IFichier) {
    const result$ = new Subject<number>();
    const service = new GedElementFactory();
    this.user$.subscribe(
      (data)=> {
        if(fichier.ged_element.user_favoris) {
          return service.detachAffectation(fichier.id, 'favoris', data.id).subscribe(
            ()=>{
              result$.next(0);
              fichier.ged_element.user_favoris = 0;
              this.notification.onInfo(` rétiré des favoris`, fichier.libelle);
            }
          )
        }
        service.attachAffectation(fichier.id, 'favoris', data.id).subscribe(
          ()=>{
            result$.next(1);
            fichier.ged_element.user_favoris = 1;
            this.notification.onInfo(` ajouté aux favoris`, fichier.libelle);
          }
        );
      }
    )
    return result$;
  }

  onToggleCacherFichier(fichier: IFichier) {
    const result$ = new Subject<IFichier>();
    const service = new FichierFactory();
    service.update({
      cacher: !fichier.ged_element.cacher
    }, fichier.id).subscribe(
      (data)=> {
        this.notification.onInfo(fichier.libelle, `${data.ged_element.cacher ? 'Cacher': 'Exposer'}`);
        result$.next(data);
      }
    )
    return result$;

  }

  onBloquerFichier(fichier: IFichier) {
    const result$ = new Subject<IFichier>();
    const modalRef = this.modalService.open(BloquerFichierComponent, { size: 'lg', centered: true,  backdrop: 'static' });
    const instance = modalRef.componentInstance as BloquerFichierComponent;
    instance.fichier = fichier;
    instance.newItem.subscribe(
      (data)=> {
        if(data.ged_element.bloquer && fichier.ged_element.bloquer) {
          this.notification.onInfo(fichier.libelle, 'Mot de passe modifier');
        } else {
          this.notification.onInfo(fichier.libelle, 'Le fichier a été bloquer');
        }
        result$.next(data);
      }
    )
    return result$;
  }

  onDebloquerFichier(fichier: IFichier) {
    const result$ = new Subject<IFichier>();
    const service = new FichierFactory();
    service.update({
      bloquer: 0
    }, fichier.id).subscribe(
      (data)=> {
        this.notification.onInfo(fichier.libelle,'Le fichier a été débloquer');
        result$.next(data);
      }
    )
    return result$;
  }

  onCheckPassword(fichier: IFichier) {
    const result$ = new Subject<number | IFichier>();
    const modalRef = this.modalService.open(CheckPassFichierComponent, { size: 'lg', centered: true,  backdrop: 'static' });
    const instance = modalRef.componentInstance as CheckPassFichierComponent;
    instance.fichier = fichier;
    instance.result.subscribe(
      (data)=> {
        if(!data) {
          this.notification.onWarning('Mot de passe incorrecte')
        } else {
          this.notification.onSuccess(fichier.libelle, 'Le fichier a été débloquer');
        }
        result$.next(data);
      }
    )
    return result$;
  }

  onTransfertFichier(fichiers: IFichier[], currentFolder: IDossier = null) {
    const result$ = new Subject<number>();
    const modalRef = this.modalService.open(ChooseDossierComponent, { size: 'lg', centered: true,  backdrop: 'static' });
    const instance = modalRef.componentInstance as ChooseDossierComponent;
    instance.selectedItemEmitter.subscribe(
      (data: IDossier)=> {
        if(currentFolder && data.id == currentFolder.id) {
          return this.notification.onInfo('Fichier dejà present dans ce dossier')
        }
        const fichiersID = fichiers.map((fichier=>fichier.id));
        const service = new FichierFactory();
        service.setAffectations(
          fichiersID,
          {
            dossiers: [data.id]
          }
        ).subscribe(
          ()=> {
            fichiers.forEach(
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

  onShareFichier(fichier: IFichier) {
    const modalRef = this.modalService.open(ShareFichierComponent, { size: 'lg', centered: true,  backdrop: 'static' });
    const instance = modalRef.componentInstance as ShareFichierComponent;
    instance.init = fichier;
  }

  onDelete(item: IFichier) {
    let _result$ = new Subject<boolean>();
    const result$ = _result$.asObservable();
    this.notification.title = 'Suppréssion';

    this.notification.body = 'Êtes-vous sûr(e) de vouloir supprimer?' + ' ' + item.libelle;

    const confirm = () => {
      const service = new FichierFactory();
      service.delete(item.id).subscribe(
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


