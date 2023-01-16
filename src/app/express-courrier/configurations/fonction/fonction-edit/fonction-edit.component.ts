import { Component, OnInit } from '@angular/core';
import { BaseEditComponent } from '../../../../shared/base-component/base-edit.component';
import { FonctionService } from './../fonction.service';
import { FormGroup } from '@angular/forms';
import { ReplaySubject } from 'rxjs';
import { Fonction } from './../fonction.model';

@Component({
  selector: 'app-fonction-edit',
  templateUrl: './fonction-edit.component.html',
  styleUrls: ['./fonction-edit.component.scss'],
})
export class FonctionEditComponent extends BaseEditComponent implements OnInit {
  fonction$ = new ReplaySubject<Fonction>(1);

  constructor(public fonctionService: FonctionService) {
    super(fonctionService);
  }

  ngOnInit(): void {
    this.subscriptions['fonction'] = this.fonctionService.singleData$.subscribe(
      (fonction) => {
        this.single = fonction;
        this.fonction$.next(fonction);
      }
    );
  }

  onEdited(form: FormGroup) {
    this.loading = true;
    this.fonctionService
      .update(this.single.id, { ...this.single, ...form })
      .subscribe(() => {
        this.loading = false;
        this.helper.notification.alertSuccess();
        this.edited.emit();
      });
  }
}
