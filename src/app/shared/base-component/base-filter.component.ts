import { BaseComponent } from './base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, AfterViewInit, OnInit } from '@angular/core';
import { BaseDependancies } from './base-dependancies';
import { AppInjector } from 'src/app/helpers/injector/app-injector.service';

@Component({
  selector: '',
  template: '',
  styles: [],
})
export abstract class BaseFilterComponent
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  public fb: FormBuilder;
  public router: Router;
  filters: FormGroup;

  constructor(
    public dependancies: BaseDependancies,
    public route: ActivatedRoute
  ) {
    super();
    this.fb = AppInjector.injector.get(FormBuilder);
    this.router = AppInjector.injector.get(Router);
  }

  ngOnInit(): void {
    this.initFilters();
  }

  abstract applyFilters(): void;

  abstract initFilters(): void;

  validateFilters(filters: {}) {
    this.router.navigate(['./'], {
      queryParams: { ...filters, page: 1 },
      queryParamsHandling: 'merge',
      relativeTo: this.route,
    });
  }

  // TODO: Renommer la methode et ses propriétes internes
  test(elementName: string, elementValue: string) {
    const elements = elementValue.split(',');
    const elementInCamelCase =
      this.helper.text.snakeToCamelCase(elementName) + 's';
    const name = `get${elementInCamelCase
      .charAt(0)
      .toUpperCase()}${elementInCamelCase.slice(1)}`;

    if (this.dependancies[name]) {
      this.dependancies[name](() => {
        this.filters.controls[elementName].patchValue(
          this.dependancies.data[elementInCamelCase].filter((element) =>
            elements.includes('' + element.id)
          )
        );
      });
    }
  }

  selectFormHandler(target: string, data: any): void {
    this.filters.get(target)?.patchValue(data.value);
  }

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.initFilters();
      Object.keys(params).forEach((paramsKey) => {
        if (this.filters.get(paramsKey))
          this.test(paramsKey, params[paramsKey]);
      });
    });
  }
}
