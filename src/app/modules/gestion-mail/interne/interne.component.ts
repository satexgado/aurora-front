import { GestionMailService } from './../gestion-mail.service';
import { CrMail, ICrMail } from 'src/app/core/models/gestion-courrier/cr-mail';
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
import { ActivatedRoute, Event, NavigationCancel, NavigationEnd, NavigationError, Router } from '@angular/router';
import { MailInterneService } from './interne.service'
import { DatePipe } from '@angular/common';
import { IFichier } from 'src/app/core/models/gestion-document/fichier.model';
@Component({
  selector: 'app-gestion-mail-interne',
  templateUrl: 'interne.component.html',
  styleUrls: ['./interne.component.css']
})

export class GestionMailInterneComponent implements OnInit {
  mailSelectHelper = new ItemSelectHelper();
  mailHelper: ResourceScrollableHelper;
  changePage: Subject<number> = new Subject<number>();
  total: number = 0;
  lastpage: number = 1;
  pageInput: number = 1
  page$ = new  BehaviorSubject<number>(1);
  get page() { return this.page$.getValue(); }
  set page(page: number) {
      this.page$.next(page);
  }
  onUpdateFavoris;
  onEpingleMail;
  selectedInterne: ICrMail;
  isCollapsed = null;
  loadResponse: ICrMail[];


  onToggleShit(index) {
    if(index == this.isCollapsed) {
      return this.isCollapsed = null;
    }
    this.isCollapsed = index;
  }

  constructor(
    public authService: AuthService,
    protected notificationService: NotificationService,
    private route: ActivatedRoute,
    protected modalService: NgbModal,
    public mailInterneService: MailInterneService,
    public gestionMailService: GestionMailService,
    private router: Router,
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
    let filter = this.route.routeConfig.data  && this.route.routeConfig.data[ 'filter' ] ? this.route.routeConfig.data[ 'filter' ] : new Filter('inbox_ins', true, 'eq');

    this.mailHelper = new ResourceScrollableHelper(
      new CrMailFactory(),
      new QueryOptions(
       [{or: false, filters:[filter]}],
      ).setSort([new Sort('updated_at','DESC')])
    );

    this.mailHelper.keepData = false;
    this.mailHelper.loadData();

    this.page$.pipe(
      debounceTime(800),
      distinctUntilChanged()
    )
    .subscribe((page: number) => {
      this.mailHelper.loadData(page);
    });

    this.mailHelper.listResult.subscribe(
      (result)=>{
        this.lastpage = result.last_page;
        this.total = result.total;
        // this.page = result.current_page;
        this.pageInput = result.current_page;
      }
    )

    this.router.events.subscribe((event: Event) => {
        switch (true) {
          case event instanceof NavigationEnd:
          case event instanceof NavigationCancel:
          case event instanceof NavigationError: {
            this.onLoadChild();
            break;
          }
          default: {
            break;
          }
        }
    });

    this.onLoadChild();

    this.mailInterneService.mailData$.subscribe(
        (data)=>{
            this.selectedInterne = data;

            if(data) {
              const service = new CrMailFactory();
              const queryOptions: QueryOptions = new QueryOptions([
                {or: false, filters: [
                    new Filter('mail', data.id , 'eq'),
                ]},
                {or: false, filters: [
                  new Filter('inbox_resp_ins', true, 'eq')
              ]},
              ]);
              service.list(queryOptions).subscribe(
                (data)=> {
                  this.loadResponse = data.data;
                }
              )
            }
        }
    )

    this.gestionMailService.onEmailCreated$.subscribe(
      (data)=>{

        if(!(this.selectedInterne && this.selectedInterne.id == data.mail_id)) {
          return;
        }

        if(this.loadResponse && this.loadResponse.length) {
         return this.loadResponse.push(data);
        }

        this.loadResponse = [data];
      }
    )

  }

  onLoadChild() {
    if(this.route.firstChild) {
       return this.route.firstChild.data.subscribe()
    }
    this.mailInterneService.mailData = null;
  }

  onSetSelected(mail: ICrMail) {
    this.mailInterneService.mailData = mail;
  }

  changed(page: number) {
    this.page$.next(page);
  }

  onNewMail() {
    this.gestionMailService.newMail$.next(true);
  }

  onTransfert(mail: ICrMail) {
    this.gestionMailService.transfertMail$.next(mail);
  }

  onRespond(mail) {
    this.gestionMailService.respondMail$.next(mail);
  }

  onRespondAll(mail) {
    this.gestionMailService.respondToAllMail$.next(mail);
  }

  onGetIcon(item: IFichier): string {
    const extension = item.fichier.split('.').pop();'';

    switch(extension) {
      case 'jpg': return 'fal fa-file-image';
      case 'jpeg': return 'fal fa-file-image';
      case 'png': return 'fal fa-file-image';
      case 'pdf': return 'fal fa-file-pdf';
      case 'doc': return 'fal fa-file-word';
      case 'docx': return 'fal fa-file-word';
      case 'pdf': return 'fal fa-file-zip';
      default: return 'fal fa-file';
    }
 }

 onCheckIfImage(item: IFichier) {
  const extension = item.fichier.split('.').pop();'';

  if(extension =='jpg' || extension =='jpeg' || extension =='png')
  {
    return true;
  }
  return false;
}
}
