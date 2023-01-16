import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseService } from '../services/base.service';
import { BaseComponent } from './base.component';

@Component({
  selector: '',
  template: '',
  styles: [],
})
export class BaseContainerComponent<T = any>
  extends BaseComponent<T>
  implements OnInit
{
  create = false;
  edit = false;
  filter = false;

  // A specifier à chaque fois que un component herite de  celui ci
  // Represent l'element sur lequel est s'appuie ce component: ex ministre, service, ministere
  // element!: string;

  constructor(
    public service: BaseService<T>,
    public router: Router,
    public route: ActivatedRoute,
    @Inject('string') public element: string
  ) {
    super(service);
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.route.fragment.subscribe((fragment) => {
      if (fragment === `add-${this.element}`) {
        this.create = true;
        this.helper.modal.toggle(`${this.element}-create-modal`);
      } else if (fragment === `edit-${this.element}`) {
        if (this.service.singleData || this.service.loading) {
          this.edit = true;
          this.helper.modal.toggle(`${this.element}-edit-modal`);
        } else {
          this.router.navigate(['./'], {
            relativeTo: this.route,
            queryParamsHandling: 'preserve',
          });
        }
      } else if (fragment === 'showFilter') {
        this.filter = true;
        this.helper.modal.toggle(`${this.element}-filter-modal`);
      }
    });
  }

  onCreated(): void {
    this.helper.modal.hide(`${this.element}-create-modal`);
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParamsHandling: 'preserve',
    });
  }

  onEdited(): void {
    this.helper.modal.toggle(`${this.element}-edit-modal`);
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParamsHandling: 'preserve',
    });
  }

  supprimer(item: T & { id?: number }) {
    this.helper.notification.confirm(() => {
      this.loading = true;

      this.service.delete(item.id!).subscribe(() => {
        this.loading = false;
        this.helper.notification.alertSuccess();
      });
    });
  }
}
