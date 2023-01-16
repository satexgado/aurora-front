import { tap } from 'rxjs/operators';
import { echo } from 'src/config/laravel-echo-config';
import { BaseComponent } from 'src/app/shared/base-component/base.component';
import { Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/shared/services/base.service';
import { AuthService } from '../auth/auth.service';
import { CourriersService } from '../courriers/courriers.service';
import { NotificationsService } from './notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent extends BaseComponent implements OnInit {
  constructor(
    public authService: AuthService,
    public courrierService: CourriersService,
    public notificationService: NotificationsService
  ) {
    super();
  }

  ngOnInit(): void {
    // this.getCourrier(this.authService.user.id).subscribe((courriers) => {
    //   courriers.forEach((courrier) =>
    //     this.subscribeToCourrierChannel(courrier)
    //   );
    // });
  }

  subscribeToCourrierChannel(courrier: any) {
    echo
      .private(`courrier-${courrier.id}-channel`)
      .listen('CourrierTransfererEvent', (notification: any) => {
        this.createNotification(
          'courrier transferer',
          notification.reaffectation
        );
      })
      .listen('CourrierTraiterEvent', (notification: any) => {
        this.createNotification('courrier traiter', notification.courrier);
        this.playNoficationSound();
      });
  }

  playNoficationSound(): void {
    const notificationSound = new Audio('assets/audio/notification.ogg');
    notificationSound.play();
  }

  getCourrier(user: number) {
    return this.courrierService.getByUser(user).pipe(
      tap((courriers) => {
        this.data = courriers;
      })
    );
  }

  createNotification(type: string, element: any) {
    const message = this.generateMessage(type, element);
    const notification = {
      message,
      element: type,
      element_id: type == 'courrier traiter' ? element.id : element.courrier_id,
      user: this.authService.user.id,
    };
    this.notificationService.store(notification).subscribe();
  }

  generateMessage(type: string, element: any): string {
    let message = '';

    if (type == 'courrier transferer') {
      message =
        element.cr_courrier.inscription == this.authService.user.id
          ? `Votre courrier <b>${element.cr_courrier.libelle}</b> a été transferer à ${element.suivi_par.nom_complet}`
          : `Le courrier <b>${element.cr_courrier.libelle}</b> a été réaffecté à ${element.suivi_par.nom_complet}`;
    } else if (type == 'courrier traiter') {
      message =
        element.inscription == this.authService.user.id
          ? `Le traitement de votre courrier <b>${element.libelle}</b> est terminé.`
          : `Le traitement du courrier <b>${element.libelle}</b> est terminés`;
    }

    return message;
  }
}
