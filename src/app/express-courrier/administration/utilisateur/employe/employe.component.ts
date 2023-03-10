import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeService } from './employe.service';
import { EmployeDependancies } from './employe.dependancies';
import { BaseContainerComponent } from 'src/app/shared/base-component/base-container.component';
import { Structure } from 'src/app/express-courrier/structure/structure/structure.model';
import { StructureService } from 'src/app/express-courrier/structure/structure/structure.service';
import { UsersService } from 'src/app/express-courrier/users/users.service';

@Component({
  selector: 'app-employe',
  templateUrl: './employe.component.html',
  styleUrls: ['./employe.component.scss'],
})
export class EmployeComponent extends BaseContainerComponent implements OnInit {
  structure: Structure;
  @ViewChild('search') search!: ElementRef;
  research$ = new Subject<string>();
  constructor(
    public structureService: StructureService,
    public employeService: EmployeService,
    public userService: UsersService,
    public dependancies: EmployeDependancies,
    public router: Router,
    public route: ActivatedRoute
  ) {
    super(employeService, router, route, 'employe');
  }

  ngOnInit(): void {
    this.subscriptions['structure'] =
      this.structureService.singleData$.subscribe((structure) => {
        this.structure = structure;
        this.employeService.structure$.next(structure);
        this.dependancies.clearDependancies();
        // });
      });

    this.research$.pipe(debounceTime(1500)).subscribe((keyword) => {
      this.research(keyword);
    });
  }

  research(keyword: string): void {
    this.router.navigate(['./'], {
      queryParams: { search: keyword || null, page: 1 },
      queryParamsHandling: 'merge',
      relativeTo: this.route,
    });
  }

  ngAfterViewInit() {
    this.route.fragment.subscribe((fragment) => {
      if (fragment === `add-${this.element}`) {
        this.create = true;
        this.helper.modal.toggle(`${this.element}-create-modal`);
      } else if (fragment === `edit-${this.element}`) {
        if (this.userService.singleData || this.service.singleData || this.service.loading) {
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
    this.route.queryParams.subscribe((params) => {
      if (params.search) {
        if (!this.search.nativeElement.value) {
          this.search.nativeElement.value = params.search;
        }
      }

      if (!params.status) {
        // this.router.navigate(['./'], {
        //   queryParams: { status: 'valid', page: 1, per_page: 10 },
        //   queryParamsHandling: 'merge',
        //   relativeTo: this.route,
        // });
      }
    });
  }
}
