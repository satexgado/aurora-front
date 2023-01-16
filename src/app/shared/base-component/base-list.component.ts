import { BaseComponent } from './base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { BaseService } from '../services/base.service';
import { PaginationInfo } from '../interfaces/pagination-info.interface';
import { AppInjector } from '../../helpers/injector/app-injector.service';

@Component({
  selector: '',
  template: '',
  styles: [],
})
export abstract class BaseListComponent<T = any>
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  public router: Router;
  public paginationInfo: PaginationInfo = {
    currentPage: 1, // Pour la pagination
    itemsPerPage: 0,
    total: 0,
  };

  public data: T[] = [];
  public showFilter = false;

  constructor(
    public service: BaseService,
    public route: ActivatedRoute,
    @Inject('string') public element: string,
    @Inject('number') public itemsPerPage = 10
  ) {
    super(service);
    this.router = AppInjector.injector.get(Router);
  }

  ngOnInit(): void {
    this.service.paginationInfo$.subscribe((paginationInfo) => {
      this.paginationInfo = paginationInfo;
    });

    this.route.queryParams.subscribe((params) => {
      if (
        (!params.page || !params.per_page) &&
        this.route.children.length == 0
      ) {
        this.router.navigate(['./'], {
          queryParams: {
            page: this.paginationInfo.currentPage ? this.paginationInfo.currentPage : 1,
            per_page: +this.itemsPerPage,
          },

          queryParamsHandling: 'merge',
          relativeTo: this.route,
        });
      }
    });
  }

  changePage(pageNumber: number): void {
    this.helper.navigation.addParams(this.route, {
      page: pageNumber,
      per_page: this.itemsPerPage,
    });
  }

  ngAfterViewInit(): void {
    this.route.fragment.subscribe((fragment) => {
      if (fragment === 'showFilter') {
        this.showFilter = true;
        this.helper.modal.show(`${this.element}-filter-modal`);
      }
    });
  }

  modifier(item: T): void {
    this.service.singleData = item;
  }

  supprimer(item: T & { id?: number }) {
    this.helper.notification.confirm(() => {
      this.loading = true;

      this.service.delete(item.id!).subscribe(
        () => {
          this.loading = false;
          this.helper.notification.alertSuccess();
        },
        () => {
          this.loading = false;
        }
      );
    });
  }
}
