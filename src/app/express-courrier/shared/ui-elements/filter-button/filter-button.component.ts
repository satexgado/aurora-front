import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-filter-button',
  templateUrl: './filter-button.component.html',
  styleUrls: ['./filter-button.component.scss'],
})
export class FilterButtonComponent implements AfterViewInit {
  isFilterActive = false;
  constructor(public route: ActivatedRoute, public router: Router) {}

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe((params) => {
      let { page, per_page, search, ...filters } = params;

      this.isFilterActive = !!Object.keys(filters).length;

    });
  }

  annulerFiltre() {
    this.route.queryParams.subscribe((params) => {
      this.router.navigate(['./'], {
        queryParams: {
          page: params.page,
          per_page: params.per_page,
          search: params.search,
        },
        relativeTo: this.route,
      });
    });
  }
}
