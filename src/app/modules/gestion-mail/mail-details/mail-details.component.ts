import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICrMail } from 'src/app/core/models/gestion-courrier/cr-mail';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

@Component({
  selector: 'app-gestion-mail-details',
  templateUrl: 'mail-details.component.html'
})

export class GestionMailsDetailsComponent implements OnInit {
  mail: ICrMail;
  Editor = DecoupledEditor;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.route.data
    .subscribe((data: { mail: ICrMail }) => {
      if((!data.mail))
        {
          this.router.navigate(['/mail']);
        }
        this.mail = data.mail;
    });
   }

   public onReady( editor ) {
    editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
    );
  }
}
