import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseFilterComponent } from 'src/app/shared/base-component/base-filter.component';
import { StructureDependancies } from '../structure.dependancies';

@Component({
  selector: 'app-structure-filter',
  templateUrl: './structure-filter.component.html',
  styleUrls: ['./structure-filter.component.scss'],
})
export class StructureFilterComponent
  extends BaseFilterComponent
  implements OnInit
{
  constructor(
    public dependancies: StructureDependancies,
    public route: ActivatedRoute
  ) {
    super(dependancies, route);
  }

  initFilters(): void {
    this.filters = this.fb.group({
      type: [null],
    });
  }

  applyFilters(): void {
    const data = {
      type:
        this.helper.arrayObject
          .extractField(this.filters.controls.type.value)
          .join(',') || null,
    };

    // this.validateFilters(data);

    this.router.navigate([this.helper.navigation.getCurrentUrl()], {
      queryParams: { ...data, page: 1 },
      queryParamsHandling: 'merge',
    });

    this.helper.modal.hide('structure-filter-modal');
  }
}
