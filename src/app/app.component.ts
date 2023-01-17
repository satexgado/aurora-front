import { Component } from '@angular/core';
import {
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  // templateUrl: './template-aurora/template-next.component.html',
  // templateUrl: './template-aurora/annuaire.component.html',
  // templateUrl: './template-aurora/fournisseur.component.html',
  // templateUrl: './template-aurora/groupe-contact.component.html',
  // templateUrl: './template-aurora/partenaire.component.html',
  // templateUrl: './template-aurora/service.component.html',
  // templateUrl: './template-aurora/utilisateur.component.html',
  // templateUrl: './template-aurora/courrier/acceuil-entrant.component.html',
  // templateUrl: './template-aurora/courrier/labcolab_courrier.component.html',
  // templateUrl: './template-aurora/courrier/mes-courriers.component.html',
  // templateUrl: './template-aurora/courrier/propriete_courrier.component.html',

  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'express-courrier';
  loading = false;

  constructor(private router: Router) {
    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loading = false;
          break;
        }
        default: {
          break;
        }
      }
    });
  }
}
