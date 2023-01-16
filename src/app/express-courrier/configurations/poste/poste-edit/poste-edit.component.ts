import { Component, OnInit } from '@angular/core';
import { BaseEditComponent } from './../../../../shared/base-component/base-edit.component';
import { PosteService } from './../poste.service';
import { FormGroup } from '@angular/forms';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-poste-edit',
  templateUrl: './poste-edit.component.html',
  styleUrls: ['./poste-edit.component.scss'],
})
export class PosteEditComponent extends BaseEditComponent implements OnInit {
  poste$ = new ReplaySubject(1);
  constructor(public posteService: PosteService) {
    super(posteService);
  }

  ngOnInit(): void {
    this.subscriptions['poste'] = this.posteService.singleData$.subscribe(
      (poste) => {
        this.single = poste;
        this.poste$.next(this.single);
      }
    );
  }

  onEdited(form: FormGroup) {
    this.loading = true;
    this.posteService
      .update(this.single.id, { ...this.single, ...form })
      .subscribe(() => {
        this.loading = false;
        this.helper.notification.alertSuccess();
        this.edited.emit();
      });
  }
}
