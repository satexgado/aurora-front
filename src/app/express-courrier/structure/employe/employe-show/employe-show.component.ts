import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BaseSingleComponent } from 'src/app/shared/base-component/base-single.component';
import { EmployeService } from '../employe.service';

@Component({
  selector: 'app-employe-show',
  templateUrl: './employe-show.component.html',
  styleUrls: ['./employe-show.component.scss'],
})
export class EmployeShowComponent
  extends BaseSingleComponent
  implements OnInit
{
  constructor(
    public employeService: EmployeService,
    public route: ActivatedRoute
  ) {
    super(employeService, route);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.route.params.subscribe((params) => {
      this.showElement(params.id);
    });
  }

  showElement(id: number) {
    this.loading = true;
    this.employeService.show(id, true).subscribe(() => {
      this.helper.modal.show('employe-show-modal');
      this.loading = false;
    });
  }
}
