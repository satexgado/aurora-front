import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { RolesService } from './../roles.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseSingleComponent } from '../../../shared/base-component/base-single.component';
import { SlugifyPipe } from '../../../shared/pipes/slugify.pipe';
import { Authorisation } from '../autorisations/authorisations.model';
import { Scope } from './../../scopes/scopes.model';

@Component({
  selector: 'app-roles-show',
  templateUrl: './roles-show.component.html',
  styleUrls: ['./roles-show.component.scss'],
})
export class RolesShowComponent extends BaseSingleComponent implements OnInit {
  scopes = {};
  activePanelId: string;
  @ViewChild('panel') panel: NgbAccordion;
  constructor(
    public roleService: RolesService,
    public route: ActivatedRoute,
    public router: Router,
    private slugifyPipe: SlugifyPipe
  ) {
    super(roleService, route);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.route.params.subscribe((params) => {
      this.showElement(params.id);
    });

    this.subscriptions['roles'] = this.roleService.singleData$.subscribe((data) => {
      this.single?.authorisations?.forEach((authorisation: Authorisation) => {
        this.scopes[(authorisation.scope as Scope).ensemble]
          ? this.scopes[(authorisation.scope as Scope).ensemble].push(
              authorisation
            )
          : (this.scopes[(authorisation.scope as Scope).ensemble] = [
              authorisation,
            ]);
      });

      this.activePanelId = this.slugifyPipe.transform(
        Object.keys(this.scopes)[0]
      );
    });
  }

  isExpanded(panelId: string): boolean {
    return this.panel?.isExpanded(panelId);
  }

  showElement(id: number) {
    this.loading = true;
    this.roleService.show(id, true).subscribe(() => {
      this.helper.modal.show('roles-show-modal');
      this.loading = false;
    });
  }
}
