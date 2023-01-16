import { ICrMail } from './../../../core/models/gestion-courrier/cr-mail';
import { MailActionComponent } from './../gestion-mail-action.component';
import { Component, OnInit } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CrMailFactory } from 'src/app/core/services/gestion-courrier/cr-mail';
import { Filter, QueryOptions, Sort } from 'src/app/shared/models/query-options';
import { ItemSelectHelper, ResourceScrollableHelper } from 'src/app/shared/state';
import { AuthService } from 'src/app/express-courrier/auth/auth.service';
import { NotificationService } from 'src/app/shared';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-gestion-mail-inbox',
  templateUrl: 'inbox.component.html'
})

export class GestionMailInboxComponent implements OnInit {
  mailSelectHelper = new ItemSelectHelper();
  mailHelper: ResourceScrollableHelper;
  changePage: Subject<number> = new Subject<number>();
  total: number = 0;
  pageInput: number = 1
  page$ = new  BehaviorSubject<number>(1);
  get page() { return this.page$.getValue(); }
  set page(page: number) {
      this.page$.next(page);
  }
  onUpdateFavoris;
  onEpingleMail;

  constructor(
    public authService: AuthService,
    protected notificationService: NotificationService,
    protected modalService: NgbModal
  ) {
    let service = new MailActionComponent(authService, notificationService, modalService);
    this.onUpdateFavoris = (mail: ICrMail) =>  service.onUpdateFavoris(mail).subscribe(
      (mail: ICrMail)=> {
      }
    );

    this.onEpingleMail = (mail: ICrMail) =>  service.onEpingleMail(mail).subscribe(
      (statuts)=> {
      }
    );
  }

  ngOnInit() {
    this.mailHelper = new ResourceScrollableHelper(
      new CrMailFactory(),
      new QueryOptions(
        [
          {or: false, filters:[new Filter('inbox_ins', true, 'eq')]},
        ],
      ).setSort([new Sort('updated_at','DESC')])
    );
    this.mailHelper.keepData = false;
    this.mailHelper.loadData();

    this.page$.pipe(
      debounceTime(800),
      distinctUntilChanged()
    )
    .subscribe(page => this.mailHelper.loadData(page));

    this.mailHelper.listResult.subscribe(
      (result)=>{
        this.total = result.total;
        this.page = result.current_page;
        this.pageInput = result.current_page;
      }
    )
  }

  changed(page: number) {
    this.page$.next(page);
  }
}
